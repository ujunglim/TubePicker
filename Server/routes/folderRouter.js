import express from "express";
import { createFolder, getFolderList } from "../controllers/folderCon.js";

const folderRouter = express.Router();

// CREATE
folderRouter.post("/", createFolder);

// READ
folderRouter.get("/", getFolderList);

export default folderRouter;
