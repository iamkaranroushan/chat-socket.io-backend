import User from "../../model/user.js";
import jwt from "jsonwebtoken";
const protectedRoute = async (req, res, next) => {
  try {
    const token = req.cookies.jwtToken;

    if (!token) {
      return res.json({ error: "no token" });
    }
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    if (!decoded) {
      res.json({ error: "Invalid token" });
    }
    const user = await User.findById(decoded.id).select("-password");
    req.user = user;
    next();
  } catch (err) {
    res.json({ error:err.message });
  }
};
export default protectedRoute;
