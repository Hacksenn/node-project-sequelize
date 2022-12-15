const router = require("express").Router();
const userMiddleware = require("../middlewares/user-middleware");
const { Likes, Posts, Users } = require("../models");
const { Op } = require("sequelize");

// 좋아요 게시글 조회
router.get("/", userMiddleware, async (req, res) => {
  const { userId } = res.locals.user;
  const data = await Likes.findAll({
    where: { userId: userId },
    include: [{ model: Posts, model: Users }],
  });

  const result = await Promise.all(
    data.map(async (like) => {
      const count = await Likes.count({
        where: {
          postId: like.postId,
        },
      });
      return {
        postId: like.postId,
        userId: like.userId,
        nickname: like.User.nickname,
        title: like.title,
        createdAt: like.createdAt,
        updatedAt: like.updatedAt,
        likes: count,
      };
    })
  );
  const results = result.sort((a, b) => b.likes - a.likes);
  res.status(200).json({ data: results });
});

// 게시글 좋아요
router.put("/:postId", userMiddleware, async (req, res) => {
  const { postId } = req.params;
  const { userId } = res.locals.user;

  const post = await Posts.findAndCountAll({ where: { postId: postId } });

  if (!post.count) {
    return res.status(400).json({ message: "게시글이 존재하지 않습니다." });
  }

  const like = await Likes.findAndCountAll({
    where: { [Op.and]: [{ postId: postId }, { userId: userId }] },
  });
  if (like.count) {
    await Likes.destroy({
      where: { [Op.and]: [{ postId: postId }, { userId: userId }] },
    });
    return res.status(200).json({ message: "좋아요를 취소하였습니다." });
  }
  await Likes.create({ userId, postId });
  res.status(201).json({ message: "좋아요를 등록하였습니다." });
});

module.exports = router;
