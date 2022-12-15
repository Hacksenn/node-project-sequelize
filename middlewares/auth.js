const jwt = require("jsonwebtoken");
require("dotenv").config();
const { Users } = require("../models");

module.exports = (req, res, next) => {
  try {
    console.log(req.cookies);
    const { authorization } = req.cookies;

    const [authType, authToken] = (authorization || "").split("%");

    if (authToken && authType === "Bearer") {
      const { userId } = jwt.verify(authToken, process.env.SECRET);
      Users.findByPk(userId).then((user) => {
        if (user) {
          res.status(401).send({ errorMessage: "이미 로그인이 되어있습니다." });
        }
      });
      return;
    }
    next();
  } catch (err) {
    console.log(err.message);
    if (err.message === "jwt expired") {
      next();
    } else {
      res
        .status(400)
        .send({ errorMessage: "데이터의 형식이 올바르지 않습니다." });
    }
  }
};
