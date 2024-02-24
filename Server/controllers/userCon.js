import { googleAuthClientInstance } from "../app.js";
import db from "../db.js";

// 좋아한 리스트
export const getLikeList = async (req, res) => {
  try {
    const { likedList, nextPageToken } =
      // await googleAuthClientInstance.getUserLikedList(req.body.prevPageToken);
      await googleAuthClientInstance.getUserLikedList();
    res.status(200).json({ likedList, nextPageToken }); // 그 다음 페이지토큰 전달
  } catch (error) {
    console.error("Error retrieving video information:", error.message);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

// 구독하는 채널 리스트
export const getSubChannelList = async (req, res) => {
  const { email } = req;

  try {
    const { subList } = await googleAuthClientInstance.getSubscriptionList();
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
    console.error("Error retrieving sub list:", error.message);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

// 플레이리스트
export const getPlayList = async (req, res) => {
  try {
    const playlists = await googleAuthClientInstance.getUserPlaylist();
    res.status(200).json(playlists);
  } catch (error) {
    console.error("Error retrieving video information:", error.message);
    res.status(500).json({ error: "Internal Server Error" });
  }
};
