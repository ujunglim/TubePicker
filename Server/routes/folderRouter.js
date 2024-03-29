import express from "express";
import {
  createFolder,
  getFolderList,
  deleteFolder,
  getVideoOfFolder,
  editFolder,
} from "../controllers/folderCon.js";
import { verifyToken } from "../middleware/auth.js";

const folderRouter = express.Router();
// CREATE
folderRouter.post("/", verifyToken, createFolder);

// EDIT
folderRouter.put("/", verifyToken, editFolder);

// READ
folderRouter.get("/", verifyToken, getFolderList);

// DELETE
folderRouter.delete("/", verifyToken, deleteFolder);

// GET DETAIL OF FOLDER
folderRouter.get("/detail/:id", verifyToken, getVideoOfFolder);

export default folderRouter;
