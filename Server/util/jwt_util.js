import jwt from "jsonwebtoken";
import dotenv from "dotenv";
dotenv.config();

// access token 발급
export const makeAccessToken = (email) => {
  return jwt.sign({ email }, process.env.ACCESS_SECRET, {
    expiresIn: "5s",
    issuer: "ujung",
  });
};

// refresh token 발급
export const makeRefreshToken = (email) => {
  return jwt.sign({ email }, process.env.REFRESH_SECRET, {
    expiresIn: "10s",
    issuer: "ujung",
  });
};

const checkRefresh = async (refreshToken) => {
  try {
    const decoded = jwt.verify(refreshToken, process.env.REFRESH_SECRET);
  } catch (err) {}
};

// access token 인증
export const verifyAccessToken = (accessToken, refreshToken) => {
  console.log("클라 => 서버 엑세스", accessToken);

  try {
    // 인증 성공
    const decoded = jwt.verify(accessToken, process.env.ACCESS_SECRET); // 토큰 검증
    console.log("decoded ", decoded);
    return {
      isVerified: true,
      decoded,
    };
  } catch (err) {
    console.log("액세서토큰 검사오류", err);
    return {
      isVerified: false,
      status: 419,
      msg: "액세스토큰이 만료되었습니다.",
    };
    // if (err.name === "TokenExpiredError") {
    //   return {
    //     isVerified: false,
    //     status: 419,
    //     msg: "토큰이 만료되었습니다.",
    //   };
    // }
    // return {
    //   isVerified: false,
    //   status: 401,
    //   msg: "유효하지 않은 토큰입니다.",
    // };
  }
};
