import express from "express";
import { createFolder } from '../controllers/folderCon';

const folderRout = express.Router();

folderRout.post('/create', createFolder);

export default folderRout;
