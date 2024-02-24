import {
  getLikeList,
  getPlayList,
  getSubChannelList,
} from "../controllers/userCon.js";
import { verifyToken } from "../middleware/auth.js";
import express from "express";

const userRouter = express.Router();

userRouter.get("/likeList", verifyToken, getLikeList);
userRouter.get("/subChannelList", verifyToken, getSubChannelList);
userRouter.get("/playList", verifyToken, getPlayList);

export default userRouter;
