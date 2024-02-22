import { googleAuthClientInstance } from "../app.js";
import db from "../db.js";

/**
 *
 * @description Create folder
 * @route POST /folder
 */
export const createFolder = async (req, res, next) => {
  const { email } = req;
  try {
    const { name, list } = req.body;
    const jsonList = JSON.stringify(list);
    // add new folderList to folder table
    const result1 = await db.myQuery(
      "INSERT INTO folder (name, subList) VALUES (?, ?)",
      [name, jsonList]
    );

    // add folderId to user table from the previous result1
    const newFolderId = String(result1.insertId);
    const qry = `UPDATE user SET folderIdList = JSON_MERGE(folderIdList, JSON_ARRAY(?)) WHERE email = ?`;
    await db.myQuery(qry, [newFolderId, email]);
    console.log("folder has been created");

    // get new folder list
    getFolderList(req, res);
  } catch (err) {
    res.status(409).json({ message: err });
  }
};

/**
 * @description Read folder list
 * @route GET /folder
 */
export const getFolderList = async (req, res) => {
  const { email } = req;
  try {
    const folderIdListSql = "SELECT folderIdList FROM user where email = ? ";
    const result1 = await db.myQuery(folderIdListSql, [email]);
    const insertedIdArr = JSON.parse(result1[0].folderIdList);

    // 아직 리스트가 없는 경우
    if (!insertedIdArr.length) {
      return res.status(200).json([]);
    }
    const folderIds = insertedIdArr.join(",");
    const folderListSql = `SELECT * FROM folder WHERE id IN (${folderIds})`;

    const result2 = await db.myQuery(folderListSql, [folderIds]);
    return res.status(200).json(result2);
  } catch (err) {
    res.status(409).json({ message: err.message });
  }
};

export const deleteFolder = async (req, res, next) => {
  const {
    email,
    body: { id },
  } = req;
  // delete folder id from folder list
  const deleteFolderSQL = `DELETE FROM folder WHERE id = ?`;
  db.query(deleteFolderSQL, [id], (err) => {
    if (err) {
      console.error("error to delete folder", id);
      return;
    }
  });
  const qry = `UPDATE user
  SET folderIdList = JSON_REMOVE(
    folderIdList, replace(JSON_SEARCH(folderIdList, 'one', ?), '"', '')) WHERE email = ?`;
  db.query(qry, [String(id), email], (err, result) => {
    if (err) {
      console.error("[error to edit folderidlist]", err);
      res.status(500).send();
    }
    if (result) {
      console.log("---result: ", result);
    }
    res.status(200).send();
  });
};
/**
 * @description get videos of a folder
 * @route GET /folder/detail/:id
 */
export const getVideoOfFolder = async (req, res) => {
  const folderId = req.params.id;
  const { subList } = (
    await db.myQuery("SELECT subList FROM folder WHERE id = ?", [folderId])
  )[0];
  const subListArr = Object.values(subList);
  const allSubListArr = [];

  for (const subId of subListArr) {
    try {
      const data = await googleAuthClientInstance.getVideoOfAChannel(subId);
      allSubListArr.push(...data);
    } catch (err) {
      console.log("[Error] Getting video of channel");
    }
  }
  // 시간순으로 정렬
  allSubListArr.sort((a, b) => b.publishedAt - a.publishedAt);
  res.status(200).json({ list: allSubListArr });
};
