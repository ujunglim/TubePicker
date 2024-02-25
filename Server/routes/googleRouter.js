import express from "express";
import { googleAuthClientInstance } from "../app.js";
import db from "../db.js";
import { makeAccessToken, makeRefreshToken } from "../util/jwt_util.js";

const googleRouter = express.Router();

googleRouter.post("/get_login_url", (req, res) => {
  const auth2Url = googleAuthClientInstance.getAuth2Url();
  res.json({ auth2Url });
});

// 구글 로그인
googleRouter.get("/send_auth_code", async (req, res) => {
  console.log("/google/send_auth_code", req.query.code);
  const accessToken = await googleAuthClientInstance.getGoogleAccessToken(
    req.query.code
  );
  // TODO save the tokens for every session, use the session's token to restore the googleAuthClient later
  // req.session.token = accessToken; // Save the token to the session
  await googleAuthClientInstance.initWithAccessToken(accessToken);
  // 구글 서버로부터 사용자 정보 획득
  const { id, email, name, picture } =
    await googleAuthClientInstance.getUserInfo();
  res.cookie("userid", id);
  res.cookie("userEmail", email);
  res.cookie("userName", name);
  res.cookie("userPic", picture);

  try {
    // 로그인 성공하면 브라우저에 accessToken, refreshToken 발급
    const accessToken = makeAccessToken(email);
    const refreshToken = makeRefreshToken(email);

    // 쿠키에 담아서 token전송
    res.cookie("accessToken", accessToken, { secure: true, httpOnly: true }); // httpOnly true이면 js에서 쿠키에 접근불가
    res.cookie("refreshToken", refreshToken, { secure: true, httpOnly: true });

    // refreshToken, email DB에 저장
    // db.myQuery("INSERT INTO activeUser ()");
    console.log(req.ip, "ip is -----");

    // res.status(200).json({msg:"로그인 성공"});
  } catch (err) {
    res.status(500).json({ msg: "로그인 실패" });
  }

  // ============== DB ==============
  // 구글 로그인
  try {
    // 새로운 user인지 확인
    const result = await db.myQuery(
      "SELECT COUNT(*) AS count FROM user WHERE email = ?",
      [email]
    );
    const isNewUser = result[0].count === 0;

    // 새로운 user이면 db에 추가
    if (isNewUser) {
      await db.myQuery(
        "INSERT INTO user (email, folderIdList, subList) VALUES (?, JSON_ARRAY(), JSON_OBJECT())",
        [email]
      );
    }
  } catch (err) {
    console.log(`[ERROR] log in`);
  }

  const env = process.env.NODE_ENV.trim();
  console.log(`========= Server is in [${env}] ==========`);
  switch (env) {
    case "dev":
      res.redirect("http://localhost:9090/home");
      break;
    case "pro":
      res.redirect("https://ujung.link/home");
      break;
  }
});

export default googleRouter;
