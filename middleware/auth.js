
const jwt = require("jsonwebtoken");

module.exports = function(req,res,next){
    const token = req.header("token")
    if(!token) return res.status(401).json({message: "auth error"})
    try{
        const decoded = jwt.verify(token, "randomString")
        req.user= decoded.user;
        next();
    }catch(error){
        console.log(error)
        res.status(500).send({message: "invalid token"})
    }
}

