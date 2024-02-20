import express from "express";
import path, { dirname } from "path";
import cors from "cors";
import GoogleAuthClient from "./google_utils.js";
import session from "express-session";
import cryptoModule from "crypto";
import dotenv from "dotenv";
import https from "https";
import fs from "fs";
import folderRouter from "./routes/folderRouter.js";
import { fileURLToPath } from "url";
import jwt from "jsonwebtoken";
import { verifyToken } from "./middleware/auth.js";
import bodyParser from "body-parser";
import db from "./db.js";

// Init Constants
const PORT = 9090;
const app = express();
dotenv.config(); // Load environment variables from .env file

// Setting up Server
app.use(cors());
app.use(express.json());
app.use(bodyParser.json());
app.use(
  session({
    secret: cryptoModule.randomUUID(), // session을 암호화하고 보안을 강화하기 위한 키
    resave: false,
    saveUninitialized: false,
  })
);

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
app.use(express.static(path.join(__dirname, "/../Client/build"))); // js, css등을 express에서 접근가능하게 한다.

export const googleAuthClientInstance = new GoogleAuthClient();

// check server is opened or not
app.get("/ping", (req, res) => {
  console.log("==== Server is online  ===");
  res.status(200).send("Server is online ");
});

app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "/../Client/build", "index.html"));
});

app.post("/google/get_login_url", function (req, res) {
  console.log("/google/get_login_url");
  const auth2Url = googleAuthClientInstance.getAuth2Url();
  res.json({ auth2Url });
});

// 구글 로그인 인증되면 구글서버->앱서버로 인증코드 전송
app.get("/google/send_auth_code", async function (req, res) {
  console.log("/google/send_auth_code", req.query.code);
  const accessToken = await googleAuthClientInstance.getAccessToken(
    req.query.code
  );
  // TODO save the tokens for every session, use the session's token to restore the googleAuthClient later
  req.session.token = accessToken; // Save the token to the session
  await googleAuthClientInstance.initWithAccessToken(accessToken);
  const { id, email, name, picture } =
    await googleAuthClientInstance.getUserInfo();
  // console.log(id, email, name, picture);
  res.cookie("userid", id);
  res.cookie("userEmail", email);
  res.cookie("userName", name);
  res.cookie("userPic", picture);
  // 로그인 성공하면 jwt토큰을 클라이언트한테 발급
  const jwtToken = jwt.sign({ email }, process.env.JWT_SECRET);
  res.cookie("jwt", jwtToken);

  // ============== DB ==============
  // 새로운 user 추가
  db.query(
    "SELECT COUNT(*) AS count FROM user WHERE email = ?",
    [email],
    (err, rows) => {
      if (err) {
        console.error("Failed to execute query: ", err);
        return;
      }

      const count = rows[0].count;

      if (count > 0) {
        console.log(`EMAIL ${email} exists in the table.`);
      } else {
        console.log(`EMAIL ${email} does not exist in the table.`);

        // 존재하지 않는 새로운 유저 추가
        db.query(
          "INSERT INTO user (email, folderIdList) VALUES (?, JSON_ARRAY())",
          [email],
          (err, result) => {
            if (err) {
              console.error("Failed to insert user: ", err);
              return;
            }
            console.log("===== User added successfully ======");
          }
        );
      }
    }
  );

  db.query("SELECT * FROM user", (err, rows) => {
    if (err) {
      console.error("Failed to read table: ", err);
      return;
    }
    console.log("Table data:", rows);
  });

  const env = process.env.NODE_ENV.trim();
  console.log(`========= Server is in [${env}] ==========`);
  switch (env) {
    case "dev":
      res.redirect("http://localhost:9090/home");
      break;
    case "pro":
      res.redirect("https://ujung.link/home");
      break;
  }
});

app.post("/api/plalist", async function (req, res) {
  try {
    const playlists = await googleAuthClientInstance.getUserPlaylist();
    res.json(playlists);
  } catch (error) {
    console.error("Error retrieving video information:", error.message);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

app.get("/likedlist", verifyToken, async (req, res) => {
  console.log(`got liked list of ${req.email}`);
  try {
    const { likedList, nextPageToken } =
      // await googleAuthClientInstance.getUserLikedList(req.body.prevPageToken);
      await googleAuthClientInstance.getUserLikedList();
    res.json({ likedList, nextPageToken }); // 그 다음 페이지토큰 전달
  } catch (error) {
    console.error("Error retrieving video information:", error.message);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

app.get("/subscriptionList", verifyToken, async (req, res) => {
  try {
    const { subList } = await googleAuthClientInstance.getSubscriptionList();
    res.json({ subList });
  } catch (error) {
    console.error("Error retrieving sub list:", error.message);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// =========== ROUTES ===========
app.use("/folder", folderRouter);
// app.use(notFound);
// app.use(handleError);

app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "/../Client/build", "index.html"));
});

let httpsServer;

// ========= DATABASE ===========
const environment = process.argv[2];
// environment pro이면 ssl, https 설정
if (environment === "pro") {
  // SSL 인증서 키
  const sslKeys = {
    ca: fs.readFileSync("/etc/letsencrypt/live/ujung.link/fullchain.pem"),
    key: fs.readFileSync("/etc/letsencrypt/live/ujung.link/privkey.pem"),
    cert: fs.readFileSync("/etc/letsencrypt/live/ujung.link/cert.pem"),
  };
  httpsServer = https.createServer(sslKeys, app);
}

if (environment === "pro") {
  httpsServer.listen(443, () => {
    console.log("[PRO]Listening on 443");
  });
} else {
  app.listen(PORT, () => {
    console.log(`[DEV]Listening on ${PORT}`);
  });
}
