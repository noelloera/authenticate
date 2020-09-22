const jwt = require("jsonwebtoken");

module.exports = function (req, res, next) {
  const accessToken = req.header("access_token");
  try {
    jwt.verify(accessToken, process.env.ACCESS_TOKEN_SECRET,(error,user)=>{
        if(error) res.status(500).send({ message: "fatal error" });
        req.body.id = user.id
        console.log(user.id)
        next();
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({ message: "invalid token" });
  }
};
