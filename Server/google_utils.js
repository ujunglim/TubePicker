const fs = require("fs");
const { google } = require("googleapis");
const oauthClientJson = fs.readFileSync("oauth_client.json", "utf8");
const oauthClient = JSON.parse(oauthClientJson);

class GoogleAuthClient {
  constructor() {
    this._initClient();
  }

  _initClient() {
    this.scopes = [
      "https://www.googleapis.com/auth/youtube.force-ssl",
      "https://www.googleapis.com/auth/youtube",
      "https://www.googleapis.com/auth/userinfo.email",
    ];
    this.client = new google.auth.OAuth2(
      oauthClient.web.client_id,
      oauthClient.web.client_secret,
      oauthClient.web.redirect_uris
    );
  }

  getAuth2Url() {
    const authorizationUrl = this.client.generateAuthUrl({
      access_type: "offline",
      scope: this.scopes,
    });
    return authorizationUrl;
  }

  async getAccessToken(authCode) {
    const res = await this.client.getToken(authCode);
    console.log("[getAccessToken] AccessToken acquired");
    return res.tokens;
  }

  async initWithAccessToken(tokens) {
    await this.client.setCredentials(tokens);
    this.youtube = google.youtube({ version: "v3", auth: this.client });
    console.log("[initWithToken] Credentials set", this.client.credentials);
  }

  // ============= api ====================
  async getUserPlaylist() {
    const response = await this.youtube.playlists.list({
      part: "snippet",
      mine: true, // Set to true to get the playlists of the authenticated user
      maxResults: 50, // Adjust as needed
    });

    const playlists = response.data.items.map((playlist) => {
      return {
        title: playlist.snippet.title,
        id: playlist.id,
      };
    });
    return playlists;
  }

  async getUserLikedList() {
    const response = await this.youtube.playlistItems.list({
      part: "snippet",
      maxResults: 20,
      playlistId: "LL", // "LL"은 유저가 "좋아요"한 동영상의 Playlist ID
    });

    const likedVideos = response.data.items.map((item) => {
      const {
        title,
        resourceId: { videoId },
        publishedAt,
        description,
        thumbnails,
        videoOwnerChannelTitle,
        videoOwnerChannelId,
      } = item.snippet;

      return {
        id: videoId,
        title,
        channelTitle: videoOwnerChannelTitle,
        description,
        publishedAt,
        thumbnails,
      };
    });
    return likedVideos;
  }
}

module.exports = GoogleAuthClient;
