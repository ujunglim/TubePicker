import db from "../db.js";
import GoogleAuthClient from "../util/google_util.js";

// 좋아한 리스트
export const getLikeList = async (req, res) => {
  try {
    const gClient = new GoogleAuthClient();
    const googleAccessToken = req.cookies.googleAccessToken;
    gClient.initWithAccessToken(googleAccessToken);

    const { likedList, nextPageToken } = await gClient.getUserLikedList(
      req.body?.prevPageToken
    );
    // getUserLikedList(req.body.prevPageToken);

    res.status(200).json({ nextPageToken, likedList }); // 그 다음 페이지토큰 전달
  } catch (error) {
    const status = error.status;
    if (status === 403) {
      return res.status(404).json({
        error: "가능한 유튜브 요청량을 초과했습니다. 잠시후 다시 시도해주세요",
      });
    }
    res.status(500).json({ error: "Internal Server Error" });
  }
};

// 구독하는 채널 리스트
export const getSubChannelList = async (req, res) => {
  const { email } = req;
  const gClient = new GoogleAuthClient();
  const googleAccessToken = req.cookies.googleAccessToken;
  gClient.initWithAccessToken(googleAccessToken);

  try {
    const { subList } = await gClient.getSubscriptionList();
    const obj = {};
    subList.forEach(({ id, name, img }) => {
      obj[name] = {
        id,
        img,
      };
    });
    const qry = "UPDATE user SET subList = ? WHERE email = ?";
    db.myQuery(qry, [JSON.stringify(obj), email]);
    res.status(200).json({ subList });
  } catch (error) {
    console.error("[ERROR]get구독하는 채널리스트:", error.message);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

// 플레이리스트
export const getPlayList = async (req, res) => {
  try {
    const gClient = new GoogleAuthClient();
    const googleAccessToken = req.cookies.googleAccessToken;
    gClient.initWithAccessToken(googleAccessToken);

    const playlists = await gClient.getUserPlaylist();
    res.status(200).json(playlists);
  } catch (error) {
    console.error("Error retrieving video information:", error.message);
    res.status(500).json({ error: "Internal Server Error" });
  }
};
