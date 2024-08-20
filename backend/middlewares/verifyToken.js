const jwt = require('jsonwebtoken');

const verifyToken = (req,res,next)=>{
    const headers = req.headers['authorization'];
    console.log(headers);
    const token = headers && headers.split(" ")[1];// this will split the token from the bearer
    if(token == null){
        return res.status(401).json({message:"Unauthorized access",success:false});
    }
    try {
        const decoded = jwt.verify(token,process.env.JWT_SECRET);
        req.id = decoded.id
        next();
    } catch (error) {
        return res.status(500).json({message:"Internal server error",success:false});
    }

}

module.exports = {verifyToken};