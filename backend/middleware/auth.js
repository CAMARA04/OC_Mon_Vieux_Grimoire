const jwt = require("jsonwebtoken");

module.exports = (req, res, next) => {
  try {
    const token = req.headers.authorization.split(" ")[1];
    const decodedToken = jwt.verify(token, process.env.SECRETTOKEN);
    const userId = decodedToken.userId;
    req.auth = {
      userId: userId,
    };
    console.log("Authentication successful");
    next();
  } catch (error) {
    console.error("Authentication failed:", error);
    res.status(401).json({ error });
  }
};
