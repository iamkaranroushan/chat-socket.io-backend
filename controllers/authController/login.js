import User from "../../model/user.js"
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

const loginUser = async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: "User not found" });
    }
    const isValidPassword = await bcrypt.compare(password, user.password);
    if (!isValidPassword) {
      return res.status(401).json({ message: "Invalid credentials" });
    }
    const tokenData = {
      id: user._id,
      name: user.username,
    };
    const token = jwt.sign(tokenData, process.env.JWT_SECRET, {
      expiresIn: "1d",
    });
    const oneDayInMillis = 24 * 60 * 60 * 1000;
    res.cookie("jwtToken", token, {
      httpOnly: true,
      maxAge: oneDayInMillis,
    });
    return res.status(200).json({ user });
  } catch (error) {
    console.log("Error:", error.message);
    return res.status(500).json({ message: "Internal server error" });
  }
};
export default loginUser;
