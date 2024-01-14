const express = require("express");
const path = require("path");
const cors = require("cors");
const GoogleAuthClient = require("./google_utils.js");
const session = require("express-session");
const cryptoModule = require("crypto");
const mysql = require("mysql2");
const dotenv = require("dotenv");
const https = require("https");
const fs = require("fs");

// Init Constants
const PORT = 9090;
const app = express();
dotenv.config(); // Load environment variables from .env file

// Setting up Server
app.use(cors());
app.use(express.json());
app.use(
  session({
    secret: cryptoModule.randomUUID(), // session을 암호화하고 보안을 강화하기 위한 키
    resave: false,
    saveUninitialized: false,
  })
);
app.use(express.static(path.join(__dirname, "/../Client/build"))); // js, css등을 express에서 접근가능하게 한다.

const googleAuthClientInstance = new GoogleAuthClient();

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

// 인증되면 구글서버->앱서버로 인증코드 전송
app.get("/google/send_auth_code", async function (req, res) {
  console.log("/google/send_auth_code", req.query.code);
  const accessToken = await googleAuthClientInstance.getAccessToken(
    req.query.code
  );
  // TODO save the tokens for every session, use the session's token to restore the googleAuthClient later
  req.session.token = accessToken; // Save the token to the session
  await googleAuthClientInstance.initWithAccessToken(accessToken);
  res.redirect(
    "http://ec2-43-203-78-29.ap-northeast-2.compute.amazonaws.com:9090/home"
  ); // TODO dev/pro
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

app.post("/api/likedlist", async (req, res) => {
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

app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "/../Client/build", "index.html"));
});

// ========= DATABASE ===========
console.log(process.env.NODE_ENV, "=========================");
const environment = process.argv[2];
// environment dev, pro판단
if (!environment) {
  console.log("Invalid Argument:", environment);
}

let dbSetting = null;
let httpsServer;
if (environment === "dev") {
  dbSetting = {
    host: process.env.AWS_DOMAIN,
    user: process.env.MYSQL_EXTERNAL_USER,
    password: process.env.MYSQL_EXTERNAL_PWD,
    database: process.env.MYSQL_EXTERNAL_DB,
  };
} else if (environment === "pro") {
  dbSetting = {
    host: "127.0.0.1",
    user: process.env.MYSQL_USER,
    password: process.env.MYSQL_PWD,
    database: process.env.MYSQL_DB,
  };

  // SSL 인증서 키
  const sslKeys = {
    ca: fs.readFileSync("/etc/letsencrypt/live/ujung.link/fullchain.pem"),
    key: fs.readFileSync("/etc/letsencrypt/live/ujung.link/privkey.pem"),
    cert: fs.readFileSync("/etc/letsencrypt/live/ujung.link/cert.pem"),
  };
  httpsServer = https.createServer(sslKeys, app);
}

console.log("[environment] ", environment, dbSetting);
const db = mysql.createConnection(dbSetting);

// Connect to MySQL
db.connect((err) => {
  if (err) {
    throw err;
  }
  console.log("MySQL connected");
});

// =========== ROUTES ===========
// app.use("/folder", folderRout);

console.log("=============", environment, "============");
if (environment === "pro") {
  httpsServer.listen(443, () => {
    console.log("[PRO]Listening on 443");
  });
} else {
  app.listen(PORT, () => {
    console.log(`[DEV]Listening on ${PORT}`);
  });
}
