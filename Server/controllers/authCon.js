import jwt from "jsonwebtoken";

export const login = async (req, res) => {
  try {
    const { userId } = req.body;
    const token = jwt.sign({ id: userId }, process.env.JWT_SECRET);
    res.status(200).json({ token });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
