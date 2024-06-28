import User from "../../model/user.js";

const saveMedia = async (req, res) => {
  try {
    const id = req.user._id;
    const img = req.body.image;
    // console.log(img)
    const user = await User.findById(id);
    if (!user) {
      res.json("no user found");
    } else {
      user.media.push(img);
    //   console.log(user.media)
      const updatedUser = await user.save();
      console.log(updatedUser)
      res.json(updatedUser);
    }
  } catch (error) {
    console.log(error)
    res.json(error);
  }
};
export default saveMedia;
