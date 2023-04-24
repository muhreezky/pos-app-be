const jwt = require("jsonwebtoken");

const verifyToken = async (req, res, next) => {
  try {
    const { authorization } = req.headers;
    if (!authorization) return res.status(401).json({ message: "Unauthorized" });
  
    const token = authorization.split(" ")[1];
    const account = await jwt.verify(token, "pos_by_grup3");
  
    if (!account) {
      return res.status(401).json({
        message: "Unauthorized"
      });
    }
  
    req.user = account;
    next();
  } catch (error) {
    return res.status(500).json({
      message: error.message
    });
  }
};

const checkOwner = async (req, res, next) => {
  try {
    const { user } = req;
  } catch (error) {
    
  }
}

module.exports = {
  verifyToken
}