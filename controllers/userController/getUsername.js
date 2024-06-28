import User from '../../model/user.js'

const getUsername = async(req, res)=>{
    try {
        const id = req.user._id;
        const user = await User.findById(id);
        if(!user){
            return res.json([]);
        }
        return res.json(user)
    } catch (error) {
        return res.json(error)
    }

}
export default getUsername;