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
    db.query(
      "INSERT INTO folder (name, subList) VALUES (?, ?)",
      [name, jsonList],
      (err, result) => {
        if (err) {
          console.error("Failed to insert user: ", err);
          return;
        }
        const insertedId = result.insertId;
        // const oldFolderIdList = db.query(
        //   "select folderIdList from user where email = ?",
        //   [email],
        //   (err, result) => {
        //     if (err) {
        //       console.error(err);
        //     }
        //   }
        // );
        // console.log(oldFolderIdList);
        console.log(`===== Folder id ${insertedId} added successfully ======`);
        // insertedId를 user table의 folderIdList에 추가
        const newJson = JSON.stringify({ insertedId: insertedId });
        const setQuery =
          "UPDATE user SET folderIdList = JSON_MERGE(folderIdList, ?) WHERE email = ?";
        db.query(setQuery, [newJson, email], (err, result) => {
          if (err) {
            console.log(`[Error on adding folderId]`, err);
            return;
          }
        });
        console.log("////////////");
      }
    );
    return res.status(201).json({ message: "folder has been created" });
  } catch (err) {
    res.status(409).json({ message: err.message });
  }
};

/**
 * @description Read all folder
 * @route GET /folder
 */
export const getFolderList = async (req, res) => {
  const { email } = req;
  try {
    const folderIdListSql = "SELECT folderIdList FROM user where email = ? ";
    db.query(folderIdListSql, [email], (err, data) => {
      if (err) {
        console.error(err);
        return res.status(500).json("error");
      }

      const result = data[0].folderIdList;
      if (result === undefined) {
        return res.status(200).json([]);
      }

      console.log("_____________ ", result);

      const folderIdList = result.insertedId;
      const folderIds = Array.isArray(folderIdList)
        ? folderIdList.join(",")
        : folderIdList;
      const folderListSql = `SELECT * FROM folder WHERE id IN (${folderIds})`;
      db.query(folderListSql, [folderIds], (err, data) => {
        if (err) {
          console.error(err);
          return res.json("error to get folder list");
        }
        console.log("get new list", data);
        return res.status(200).json(data);
      });
    });
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
