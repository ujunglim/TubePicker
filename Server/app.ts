const express = require("express");
const path = require("path");
const cors = require("cors");
const { googleAuthClient } = require("./google_utils.js");

// Init Constants
const PORT = 9090;
const app = express();

// Setting up Server
app.use(cors());
app.use(express.json());

app.post("/google/get_login_url", function (req, res) {
  console.log("/google/get_login_url");
  const auth2Url = googleAuthClient.getAuth2Url();
  console.log(auth2Url, '=========')
  res.json({ auth2Url });
});

app.get("/google/send_auth_code", async function (req, res) {
  console.log("/google/send_auth_code", req.query.code);
  const accessToken = await googleAuthClient.getAccessToken(req.query.code);
  // TODO save the tokens for every session, use the session's token to restore the googleAuthClient later
  await googleAuthClient.initWithAccessToken(accessToken);
  res.redirect("http://localhost:3000/home");
});

app.post("/api/plalist", async function (req, res) {
  try {
    const playlists = await googleAuthClient.getUserPlaylist();
    res.json(playlists);
  } catch (error) {
    console.error("Error retrieving video information:", error.message);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

app.listen(PORT, () => {
  console.log(`Listening on ${PORT}`);
});
