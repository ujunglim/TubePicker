import { verifyAccessToken } from "../util/jwt_util.js";

// accessToken 인증
export const verifyToken = (req, res, next) => {
  console.log(
    "===== START TO VERFIIY ACCESS TOKEN FROM CLIENT ==============="
  );
  // try {
  // const accessToken = req.cookies.accessToken;
  const accessToken = req.headers.authorization.split("Bearer ")[1];
  console.log("클라 => 서버 엑세스", accessToken);
  const refreshToken = req.cookies.refreshToken;
  const { isVerified, status, msg, decoded, newAccessToken } =
    verifyAccessToken(accessToken, refreshToken);
  // 인증성공
  if (isVerified) {
    if (newAccessToken) {
      res.cookie("accessToken", newAccessToken, {
        secure: true,
        httpOnly: true,
      });
    }
    req.email = decoded.email;
    return next();
  }
  // 인증 실패
  else {
    res.status(status).send({
      isVerified: false,
      msg,
    });
  }
  // const decoded = jwt.verify(token, process.env.ACCESS_SECRET); // 토큰 검증
  // } catch (err) {
  //   // 인증 실패
  //   if (err.name === "TokenExpiredError") {
  //     // refresh토큰이 만료되지 않았으면 새로운 accessToken을 발급

  //     return res.status(419).json({
  //       msg: "토큰이 만료되었습니다.",
  //     });
  //   }
  //   return res.status(401).json({
  //     msg: "유효하지 않은 토큰입니다.",
  //   });
  // }
};
