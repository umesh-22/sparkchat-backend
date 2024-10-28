
const User = require("./model/user");
const { decodeToken } = require("./jwt");

const authenticate = async(req,res,next)=>{

    const token = req.cookies.jwt
    if(!token){
        return res.status(401).json({success:false,message:"Token not found"})
    }

    const userId = await decodeToken(token);
    // const user = await User.findById(userId)
    req.userId = userId;
    next()


}





module.exports = authenticate