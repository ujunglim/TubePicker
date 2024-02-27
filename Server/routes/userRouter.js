import {
  getLikeList,
  getPlayList,
  getSubChannelList,
} from "../controllers/userCon.js";
import { verifyToken } from "../middleware/auth.js";
import express from "express";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import { makeAccessToken } from "../util/jwt_util.js";
dotenv.config();

const userRouter = express.Router();

userRouter.get("/refresh", (req, res) => {
  console.log("새로운 액세스토큰 발급");
  const refreshToken = req.cookies.refreshToken;
  try {
    const { email } = jwt.verify(refreshToken, process.env.REFRESH_SECRET);
    // 새로운 access token발급
    const newAccessToken = makeAccessToken(email);
    console.log("새로운 token2 클라에게 발급", newAccessToken);
    res.cookie("accessToken", newAccessToken, { secure: true, httpOnly: true });
    res.status(200).json({});
  } catch (err) {
    // 로그인
    console.log(err, "로그인 필요");
    res
      .status(401)
      .json({ msg: "refresh token이 만료됬습니다. 로그인해주세요" });
  }
});
userRouter.get("/likeList", verifyToken, getLikeList);
userRouter.get("/subChannelList", verifyToken, getSubChannelList);
userRouter.get("/playList", verifyToken, getPlayList);

export default userRouter;
