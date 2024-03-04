import GoogleAuthClient from "../util/google_util.js";
import db from "../db.js";

/**
 *
 * 폴더 생성
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
 * 폴더 리스트
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
/**
 * 폴더 삭제
 * @route DELETE /folder
 */
export const deleteFolder = async (req, res, next) => {
  const {
    email,
    body: { id },
  } = req;
  // delete folder id from folder list
  const deleteFolderSQL = `DELETE FROM folder WHERE id = ?`;
  await db.myQuery(deleteFolderSQL, [id]);
  const qry = `UPDATE user
  SET folderIdList = JSON_REMOVE(
    folderIdList, replace(JSON_SEARCH(folderIdList, 'one', ?), '"', '')) WHERE email = ?`;
  await db.myQuery(qry, [String(id), email]);
  res.status(200).send();
};
/**
 * 폴더 안의 비디오들 불러오기
 * @route GET /folder/detail/:id
 */
export const getVideoOfFolder = async (req, res) => {
  const folderId = req.params.id;
  const { subList } = (
    await db.myQuery("SELECT subList FROM folder WHERE id = ?", [folderId])
  )[0];
  const subListArr = Object.values(subList);
  const allSubListArr = [];
  let currPageToken = "";

  const gClient = new GoogleAuthClient();
  const googleAccessToken = req.cookies.googleAccessToken;
  gClient.initWithAccessToken(googleAccessToken);
  for (const subId of subListArr) {
    try {
      const { list, channelId, pageToken } = await gClient.getVideoOfAChannel(
        subId
      );
      allSubListArr.push(...list);
      currPageToken = pageToken;
    } catch (err) {
      console.log("[Error] 한 채널의 비디오 불러오기", err);
    }
  }
  // 최신순으로 정렬
  allSubListArr.sort((a, b) => {
    const aTimestamp = new Date(a.publishedAt).getTime();
    const bTimeStamp = new Date(b.publishedAt).getTime();
    return bTimeStamp - aTimestamp;
  });
  res.status(200).json({ pageToken: currPageToken, list: allSubListArr });
};
