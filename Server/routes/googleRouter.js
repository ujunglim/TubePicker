import express from "express";
import { googleAuthClientInstance } from "../app.js";
import db from "../db.js";
import { makeAccessToken, makeRefreshToken } from "../util/jwt_util.js";

const googleRouter = express.Router();

// 구글 로그인 권한 물어보는 url 전달
googleRouter.post("/get_login_url", (req, res) => {
  const auth2Url = googleAuthClientInstance.getAuth2Url();
  res.json({ auth2Url });
});

const generateToken = (email) => {
  const promise = new Promise((resolve, reject) => {
    let accessToken = makeAccessToken(email);
    let refreshToken = makeRefreshToken(email);
    resolve({ accessToken, refreshToken });
  });
  console.log("finish generate token");
  return promise;

  // try {
  //   // 로그인 성공하면 브라우저에 accessToken, refreshToken 발급
  //   accessToken = makeAccessToken(email);
  //   refreshToken = makeRefreshToken(email);

  //   // header
  //   res.header("Authorization", accessToken);

  //   // 쿠키에 담아서 token전송
  //   res.cookie("googleAccessToken", googleAccessToken, {
  //     secure: true,
  //     httpOnly: true,
  //   });
  //   res.cookie("accessToken", accessToken, { secure: true, httpOnly: true }); // httpOnly true이면 js에서 쿠키에 접근불가
  //   res.cookie("refreshToken", refreshToken, {
  //     secure: true,
  //     httpOnly: true,
  //     // path: "/refresh", // refresh토큰은 accessToken이 expire할때만 전송한다
  //   });
  //   console.log("==++++++++++");

  //   // refreshToken, email DB에 저장
  //   // db.myQuery("INSERT INTO activeUser ()");
  //   console.log(req.ip, "ip is -----");

  //   // res.status(200).json({ userData });
  //   // res.status(200).json({
  //   //   accessToken,
  //   //   refreshToken,
  //   // });
  // } catch (err) {
  //   res.status(500).json({ msg: "로그인 실패" });
  // }
};

// 구글 로그인 성공
googleRouter.get("/send_auth_code", async (req, res) => {
  console.log("========= LOGIN SUCCESS ==========");
  // 구글 access token
  const googleAccessToken = await googleAuthClientInstance.getGoogleAccessToken(
    req.query.code
  );
  // TODO save the tokens for every session, use the session's token to restore the googleAuthClient later
  // req.session.token = googleAccessToken; // Save the token to the session
  await googleAuthClientInstance.initWithAccessToken(googleAccessToken);
  // 구글 서버로부터 사용자 정보 획득
  const { id, email, name, picture } =
    await googleAuthClientInstance.getUserInfo();
  res.cookie("userid", id);
  res.cookie("userEmail", email);
  res.cookie("userName", name);
  res.cookie("userPic", picture);

  const userData = {
    id,
    email,
    name,
    picture,
  };

  const { accessToken, refreshToken } = await generateToken(email);

  // 쿠키에 담아서 token전송
  res.cookie("googleAccessToken", googleAccessToken, {
    secure: true,
    // httpOnly: true,
  });
  res.cookie("accessToken", accessToken, { secure: true }); // httpOnly true이면 js에서 쿠키에 접근불가
  res.cookie("refreshToken", refreshToken, {
    secure: true,
    // httpOnly: true,
    // path: "/refresh", // refresh토큰은 accessToken이 expire할때만 전송한다
  });
  console.log("서버 => 클라 토큰1: ", accessToken);

  // refreshToken, email DB에 저장
  // db.myQuery("INSERT INTO activeUser ()");
  // console.log(req.ip, "ip is -----");

  // res.status(200).json({ userData });
  // res.status(200).json({
  //   accessToken,
  //   refreshToken,
  // });

  // ============== DB ==============
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
