const jwt = require("jsonwebtoken");

function restrict() {
  return async (req, res, next) => {
    try {
      // express-session will automatically get the session ID from the cookie
      // header, and check to make sure it's valid and the session for this user exists.
      // if (!req.session || !req.session.user) {
      // 	return res.status(401).json({
      // 		message: "Invalid credentials",
      // 	})
      // }
      const token = req.headers.authorization;
      if (!token) {
        return res.status(401).json({
          message: "Invalid Credentials",
        });
      }
      //make sure the signature on the token is valid and still matches the payload (we need to use the same secret string that was used to sign the token)

      jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
        if (err) {
          return res.status(401).json({
            message: "Invalid Credentials",
          });
        }
        //make the tokens decoded payload available to other middleware functions or route handlers, in case we need to use it elsewhere
        req.token = decoded;
        console.log(decoded);

        //at this point we know the token is valid and the user is authorized
        next();
      });
    } catch (err) {
      next(err);
    }
  };
}

module.exports = {
  restrict,
};
