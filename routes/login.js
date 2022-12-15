const router = require("express").Router();
const jwt = require("jsonwebtoken");
const auth = require("../middlewares/auth");
require("dotenv").config();
const { Users } = require("../models");

// 로그인
router.post("/", auth, async (req, res) => {
  try {
    const { id, password } = req.body;

    const user = await Users.findOne({
      where: {
        id: id,
      },
    });
    // NOTE: 인증 메세지는 자세히 설명하지 않는것을 원칙으로 한다: https://cheatsheetseries.owasp.org/cheatsheets/Authentication_Cheat_Sheet.html#authentication-responses
    if (!user || password !== user.password) {
      return res.status(400).send({
        errorMessage: "이메일 또는 패스워드가 틀렸습니다.",
      });
    }
    const token = jwt.sign({ userId: user.userId }, process.env.SECRET, {
      expiresIn: "5m",
    });
    return res
      .cookie("authorization", "Bearer%" + token)
      .status(201)
      .json({ token: token });
  } catch (error) {
    console.error(error);
    return res.status(400).json({ errorMessage: "로그인에 실패하였습니다." });
  }
});

module.exports = router;
