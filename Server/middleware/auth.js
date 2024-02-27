import { verifyAccessToken } from "../util/jwt_util.js";

// accessToken 인증
export const verifyToken = (req, res, next) => {
  console.log(
    "========== START TO VERFIIY ACCESS TOKEN FROM CLIENT ==============="
  );
  const accessToken = req.cookies.accessToken;
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
};
