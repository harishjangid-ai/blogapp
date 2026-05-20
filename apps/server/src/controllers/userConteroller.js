import User from "../models/userModel.js"
export const userList = async(req, res)=>{
    try {
        const user = await User.find();
        
        return res.json(user)
    } catch (error) {
        return res.json({success: false, error})
    }
}