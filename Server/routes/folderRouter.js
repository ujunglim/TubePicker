import express from "express";
import {
  createFolder,
  getFolderList,
  deleteFolder,
} from "../controllers/folderCon.js";
import { verifyToken } from "../middleware/auth.js";

const folderRouter = express.Router();
// CREATE
folderRouter.post("/", verifyToken, createFolder);

// READ
folderRouter.get("/", verifyToken, getFolderList);

// DELETE
folderRouter.delete("/", verifyToken, deleteFolder);

export default folderRouter;
