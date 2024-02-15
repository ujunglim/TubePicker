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
    const setQuery =
      "UPDATE user SET folderIdList = JSON_MERGE(folderIdList, ?) WHERE email = ?";
    const newJson = JSON.stringify({ insertedId: result1.insertId });
    await db.myQuery(setQuery, [newJson, email]);
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
    const folderIdList = result1[0].folderIdList;
    const insertedIdList = folderIdList.insertedId;
    if (!insertedIdList) {
      return res.status(200).json([]);
    }
    const folderIds = Array.isArray(insertedIdList)
      ? insertedIdList.join(",")
      : insertedIdList;
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
  // // delete folder id from folder list
  // const deleteFolderSQL = `DELETE FROM folder WHERE id = ?`;
  // db.query(deleteFolderSQL, [id], (err) => {
  //   if (err) {
  //     console.error("error to delete folder", id);
  //     return;
  //   }
  // });
  const editFolderIdListSQL = `UPDATE user
  SET folderIdList = JSON_REMOVE(folderIdList, REPLACE(JSON_SEARCH(folderIdList, 'one', ?), '"', ''))
  WHERE email = ?;`;
  const testsql = `SELECT JSON_SEARCH(folderIdList, 'one', ?) from user`;
  db.query(testsql, [id, email], (err, result) => {
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
