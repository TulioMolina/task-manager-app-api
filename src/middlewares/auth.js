const jwt = require("jsonwebtoken");
const User = require("../models/user");

const auth = async (req, res, next) => {
  try {
    const token = req.header("Authorization").replace("Bearer ", "");
    const decoded = jwt.verify(token, "secretvalue"); //token is valid
    const user = await User.findOne({
      _id: decoded._id,
      "tokens.token": token,
    }); //user hasn't logged out with that token

    if (!user) {
      throw new Error();
    }
    // console.log(user);
    req.user = user;
    req.token = token;
    next();
  } catch (e) {
    res.status(401).send({ error: "Please authenticate." });
  }
};

module.exports = auth;
