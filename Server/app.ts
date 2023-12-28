const express = require("express");
const path = require("path");
const cors = require("cors");
const GoogleAuthClient = require("./google_utils.js");
const session = require("express-session");
const cryptoModule = require('crypto');

// Init Constants
const PORT = 9090;
const app = express();

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

const googleAuthClientInstance = new GoogleAuthClient();

app.post("/google/get_login_url", function (req, res) {
  console.log("/google/get_login_url");
  const auth2Url = googleAuthClientInstance.getAuth2Url();
  res.json({ auth2Url });
});

// 인증되면 구글서버->앱서버로 인증코드 전송
app.get("/google/send_auth_code", async function (req, res) {
  console.log("/google/send_auth_code", req.query.code);
  const accessToken = await googleAuthClientInstance.getAccessToken(req.query.code);
  // TODO save the tokens for every session, use the session's token to restore the googleAuthClient later
  req.session.token = accessToken; // Save the token to the session
  await googleAuthClientInstance.initWithAccessToken(accessToken);
  res.redirect("http://localhost:3000/home");
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

app.post('/api/likedlist', async (req, res) => {
  try{
    const {likedList, nextPageToken} = await googleAuthClientInstance.getUserLikedList(req.body.prevPageToken);
    res.json({likedList, nextPageToken}); // 그 다음 페이지토큰 전달
  } catch (error) {
    console.error("Error retrieving video information:", error.message);
    res.status(500).json({ error: "Internal Server Error" });
  }
})

app.listen(PORT, () => {
  console.log(`Listening on ${PORT}`);
});
