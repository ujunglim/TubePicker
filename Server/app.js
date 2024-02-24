import express from "express";
import path, { dirname } from "path";
import cors from "cors";
import GoogleAuthClient from "./google_utils.js";
import dotenv from "dotenv";
import https from "https";
import fs from "fs";
import { fileURLToPath } from "url";
import bodyParser from "body-parser";
import cookieParser from "cookie-parser";
import userRouter from "./routes/userRouter.js";
import folderRouter from "./routes/folderRouter.js";
import googleRouter from "./routes/googleRouter.js";

const PORT = 9090;
const app = express();
dotenv.config(); // Load environment variables from .env file

app.use(cors({ Credential: true })); // 쿠키사용
app.use(express.json());
app.use(bodyParser.json());
app.use(cookieParser());

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
app.use(express.static(path.join(__dirname, "/../Client/build"))); // js, css등을 express에서 접근가능하게 한다.

export const googleAuthClientInstance = new GoogleAuthClient();

// =========== ROUTES ===========
app.use("/google", googleRouter);
app.use("/user", userRouter);
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
