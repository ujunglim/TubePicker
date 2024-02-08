import jwt from "jsonwebtoken";

export const verifyToken = (req, res, next) => {
  try {
    let token = req.header("Authorization");
    if (!token) {
      return res.status(401).send("Unauthorized");
    }
    if (token.startsWith("Bearer ")) {
      token = token.slice(7, token.length).trimLeft();
    }
    const decoded = jwt.verify(token, process.env.JWT_SECRET); // 토큰 검증
    req.email = decoded.email;
    next();
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
