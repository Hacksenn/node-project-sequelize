const jwt = require("jsonwebtoken");
require("dotenv").config();
const { Users } = require("../models");

module.exports = (req, res, next) => {
  try {
    const { authorization } = req.cookies;
    const [authType, authToken] = (authorization || "").split("%");

    if (!authToken || authType !== "Bearer") {
      res.status(401).send({
        errorMessage: "로그인 후 이용 가능한 기능입니다.",
      });
      return;
    }

    const { userId } = jwt.verify(authToken, process.env.SECRET);
    Users.findByPk(userId).then((user) => {
      res.locals.user = user;
      next();
    });
  } catch (err) {
    res.status(401).send({
      errorMessage: "로그인 후 이용 가능한 기능입니다.",
    });
  }
};
