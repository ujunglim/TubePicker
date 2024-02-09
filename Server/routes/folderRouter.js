import express from "express";
import { createFolder, getFolderList } from "../controllers/folderCon.js";
import { verifyToken } from "../middleware/auth.js";

const folderRouter = express.Router();
// CREATE
folderRouter.post("/", verifyToken, createFolder);

// READ
folderRouter.get("/", verifyToken, getFolderList);

export default folderRouter;
