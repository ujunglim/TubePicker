import { google } from "googleapis";
import dotenv from "dotenv";
dotenv.config();
const oauthClientJson = process.env.OAUTH_CLIENT;
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

  async getUserLikedList(pageToken) {
    const option = {
      part: "snippet",
      maxResults: 20,
      playlistId: "LL", // "LL"은 유저가 "좋아요"한 동영상의 Playlist ID
    };
    if (pageToken) option.pageToken = pageToken; // 앞선 페이지 토큰이 있으면 추가하고 유튜브서버에 다음 페이지 데이터 요청
    const response = await this.youtube.playlistItems.list(option);

    const likedList = response.data.items.map((item) => {
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
    return { likedList, nextPageToken: response.data.nextPageToken };
  }
}

export default GoogleAuthClient;
