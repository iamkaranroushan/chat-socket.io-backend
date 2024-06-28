import User from "../../model/user.js"; 

const fetchMedia = async (req, res) => {
  try {
    const id = req.user._id;
    const user = await User.findById(id);
    if(!user){
        console.log("no user found")
    }else{
            res.json(user.media);
    }
  } catch (error) {
    res.json({error})
  }
};
export default fetchMedia;
