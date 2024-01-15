/**
 *
 * @description Create folder
 * @route POST /folder
 */
export const createFolder = async (req, res, next) => {
  try {
    const { userId, folderName } = req.body;
    console.log(userId, folderName);
    //
    let sql = "INSERT INTO notes (userId, folderName) VALUES (?, ?)";
    // await pool.query(sql, [userId, folderName]);

    return res.status(201).json({ message: "folder has been created" });
    // const folderList = []
    // res.status(200).json(folderList);
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
    const sql = "SELECT * FROM folders";
  } catch (err) {
    res.status();
  }
};
