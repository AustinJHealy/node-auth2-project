const jwt = require("jsonwebtoken");

module.exports = (req, res, next) => {
  const token = req.headers.authorization;

  if (token) {
    const secret = process.env.JWT_SECRET;
    jwt.verify(token, secret, (error, decodedToken) => {
      if (error) {
        //WRONG TOKEN
        res.status(401).json({ message: "YOU SHALL NOT PASS!" });
      } else {
        // TOKEN MATCHES
        req.jwt = decodedToken;
        next();
      }
    });
  } else {
    res.status(400).json({ message: "Authentication Failed" });
  }
};
