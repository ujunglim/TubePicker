import db from "../db.js";

/**
 *
 * @description Create folder
 * @route POST /folder
 */
export const createFolder = async (req, res, next) => {
  try {
    const { name } = req.body;
    db.query(
      "INSERT INTO folder (name, subList) VALUES (?, JSON_OBJECT())",
      [name],
      (err, result) => {
        if (err) {
          console.error("Failed to insert user: ", err);
          return;
        }
        console.log("===== Folder added successfully ======");
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
  try {
    const sql = "SELECT * FROM folder";
    db.query(sql, (err, data) => {
      if (err) return res.json("error");
      return res.status(200).json(data);
    });
  } catch (err) {
    res.status(409).json({ message: err.message });
  }
};
