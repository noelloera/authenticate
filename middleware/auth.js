const jwt = require("jsonwebtoken");

module.exports = function (req, res, next) {
    //Authorization header should have "Bearer token"
  const authHeader = req.headers['authorization']
  const accessToken = authHeader && authHeader.split(' ')[1]
  if(accessToken == null){res.status(401).send({message: "no token"})}
  try {
    jwt.verify(accessToken, process.env.ACCESS_TOKEN_SECRET, (error, user) => {
      if (error) {
        res.status(500).send({ message: "invalid token" });
      } else {
        req.body.id = user.id;
        next();
      }
    });
  } catch (error) {
    console.log(error);
  }
};
