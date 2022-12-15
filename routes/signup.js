const router = require("express").Router();
const { Users } = require("../models");
const { Op } = require("sequelize");

// 회원가입
router.post("/", async (req, res) => {
  const { id, nickname, password, confirm } = req.body;

  // id or nickname이 동일한게 이미 있는지 확인하기 위해 가져온다.
  const existsUsers = await Users.findAll({
    where: {
      [Op.or]: [{ id }, { nickname }],
    },
  });

  if (password !== confirm) {
    return res.status(400).send({
      errorMessage: "패스워드가 패스워드 확인란과 다릅니다.",
    });
  } else if (existsUsers.length) {
    return res.status(400).send({
      errorMessage: "아이디 또는 닉네임이 이미 사용중입니다.",
    });
  } else if (!/^(?=.*[a-zA-Z])[-a-zA-Z0-9_.]{3,}$/.test(id)) {
    return res
      .status(400)
      .json({ errorMessage: "ID의 형식이 일치하지 않습니다." });
  } else if (password.length < 4) {
    return res
      .status(400)
      .json({ errorMessage: "비밀번호는 4자 이상이어야 합니다." });
  } else if (password.indexOf(id) > -1) {
    return res
      .status(400)
      .json({ errorMessage: "비밀번호에 아이디가 포함되었습니다." });
  }

  await Users.create({ id, nickname, password });
  res.status(201).send({ message: "회원 가입에 성공하였습니다." });
});

module.exports = router;
