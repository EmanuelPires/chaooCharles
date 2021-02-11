//function
//check if user is logged
//does token exist.

const jwt = require("jsonwebtoken");

function auth(req, res, next) {
  const token = req.header("x-auth-token");
  if (!token) return res.status(401).send("Not authorized biiitch");

  try {
    const secretKey = process.env.SECRET_KEY;
    const payload = jwt.verify(token, secretKey);
    req.user = payload;
    next();
  } catch (error) {
    res.status(400).send("invalid token");
  }
}

module.exports = auth;
