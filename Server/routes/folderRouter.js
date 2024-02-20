import express from "express";
import {
  createFolder,
  getFolderList,
  deleteFolder,
  getVideoOfaChannel,
} from "../controllers/folderCon.js";
import { verifyToken } from "../middleware/auth.js";

const folderRouter = express.Router();
// CREATE
folderRouter.post("/", verifyToken, createFolder);

// READ
folderRouter.get("/", verifyToken, getFolderList);

// DELETE
folderRouter.delete("/", verifyToken, deleteFolder);

// GET DETAIL OF FOLDER
folderRouter.get("/detail/:id", verifyToken, getVideoOfaChannel);

export default folderRouter;
