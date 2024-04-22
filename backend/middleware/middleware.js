const jwt = require("jsonwebtoken");
const { JWT_SECRET } = require("../config.js");

const authMiddleware = (req, res, next) => {
   const { authorization } = req.headers;
    
   if(!authorization || !authorization.startsWith("Bearer")) {
     return res.status(403).json({})
    }

   const token = authorization.split(" ")[1];

  try {
    const decodedValue = jwt.verify(token, JWT_SECRET);
    req.userId = decodedValue.userId;
    next();
  } catch (error) {
    res.status(411).json({});
  }
};


module.exports = {
  authMiddleware
}
