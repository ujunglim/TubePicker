import jwt from "jsonwebtoken";
import dotenv from "dotenv";
dotenv.config();

// access token 발급
export const makeAccessToken = (email) => {
  return jwt.sign({ email }, process.env.ACCESS_SECRET, {
    expiresIn: "500s",
    issuer: "ujung",
  });
};

// refresh token 발급
export const makeRefreshToken = (email) => {
  return jwt.sign({ email }, process.env.REFRESH_SECRET, {
    expiresIn: "1000s",
    issuer: "ujung",
  });
};

// access token 인증
export const verifyAccessToken = (accessToken, refreshToken) => {
  try {
    // 인증 성공
    const decoded = jwt.verify(accessToken, process.env.ACCESS_SECRET); // 토큰 검증
    console.log("decoded ", decoded);
    return {
      isVerified: true,
      decoded,
    };
  } catch (err) {
    console.log("액세스 토큰 검사오류", err);
    return {
      isVerified: false,
      status: 419,
      msg: "액세스토큰이 만료되었습니다.",
    };
  }
};
