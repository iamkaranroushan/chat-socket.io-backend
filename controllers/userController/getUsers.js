import User from '../../model/user.js'

const getAllUsers = async(req, res)=>{
    try {
        const id = req.user._id;
        const allUsers = await User.find({_id:{$ne: id}});
        // console.log(allUsers);
        return res.json(allUsers)
    } catch (error) {
        return res.json(error)
    }

}
export default getAllUsers ;