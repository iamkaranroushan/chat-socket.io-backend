import User from "../../model/user.js"
import bcrypt from "bcrypt";

const registerUser = async (req, res) => {
  const { username, email, password } = req.body;
  try {
    const user = await User.findOne({ email });
    if (user) {
      return res.status(400).json({ message: "User already exists" });
    }
    const saltRounds = 11;
    const salt = await bcrypt.genSalt(saltRounds);
    const hashedPassword = await bcrypt.hash(password, salt);
    const newUser = new User({
      username,
      email,
      password: hashedPassword,
    });
    const savedUser = await newUser.save();
    return res.status(201).json({ message: "User created", savedUser });
  } catch (error) {
    console.log("Error:", error.message);
    return res.status(500).json({ message: "Internal server error" });
  }
};

export default registerUser;
