const jwt = require("jsonwebtoken");

const verifyToken = (req, res, next) => {
  //Access Authorization from req heasder
  const Authorization = req.header("authorization");
  if (!Authorization) {
    //Error: Unauthorized
  }

  //get token
  const token = Authorization.replace("Bearer", "");

  //Verify token
  const { userId } = jwt.verify(token, process.env.APP_SECRET);

  //Assign req
  req.user = { userId };
  next();
};

module.exports = verifyToken;
