import jwt from "jsonwebtoken";
import dotenv from "dotenv";
dotenv.config();

// access token 발급
export const makeAccessToken = (email) => {
  return jwt.sign({ email }, process.env.ACCESS_SECRET, {
    expiresIn: "1m",
    issuer: "ujung",
  });
};

// refresh token 발급
export const makeRefreshToken = (email) => {
  return jwt.sign({ email }, process.env.REFRESH_SECRET, {
    expiresIn: "24h",
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
  try {
    // 인증 성공
    const decoded = jwt.verify(accessToken, process.env.ACCESS_SECRET); // 토큰 검증
    return {
      isVerified: true,
      decoded,
    };
  } catch (err) {
    if (err.name === "TokenExpiredError") {
      // refresh토큰이 만료되지 않았으면 새로운 accessToken을 발급
      try {
        // check refresh
        // if refresh is valid
        // create new access token then send to browser
        return {
          isVerified: true,
          newAccessToken,
        };
      } catch (err) {
        // access, refresh both expired
      }

      return {
        isVerified: false,
        status: 419,
        msg: "토큰이 만료되었습니다.",
      };
    }
    return {
      isVerified: false,
      status: 401,
      msg: "유효하지 않은 토큰입니다.",
    };
  }
};
