const router = require("express").Router();
const userMiddleware = require("../middlewares/user-middleware");
const { Comments, Users, Posts } = require("../models");

// 댓글 목록 조회 API
router.get("/", async (req, res) => {
  const comments = await Comments.findAll({ include: [Users, Posts] });
  if (!comments) {
    return res.status(400).send({
      message: "데이터 형식이 올바르지 않습니다.",
    });
  }
  const result = comments.map((comment) => {
    return {
      postId: comment.postId,
      commentId: comment.commentId,
      userId: comment.userId,
      nickname: comment.User.nickname,
      comment: comment.comment,
      createdAt: comment.createdAt,
      updatedAt: comment.updatedAt,
    };
  });
  res.status(200).json({ data: result });
});

// 댓글 작성 API

router.post("/:postId", userMiddleware, async (req, res) => {
  const { postId } = req.params;
  const { comment } = req.body;
  const { userId } = res.locals.user;

  if (!comment) {
    return res.status(400).send({
      message: "댓글 내용을 입력해주세요",
    });
  }

  await Comments.create({ postId, userId, comment });

  res.status(201).json({ message: "댓글을 생성하였습니다." });
});

// 댓글 수정 API
router.patch("/:commentId", userMiddleware, async (req, res) => {
  const { commentId } = req.params;
  const { comment } = req.body;
  const { userId } = res.locals.user;

  const commentOne = await Comments.findOne({
    where: { commentId: commentId },
  });
  if (!commentOne) {
    return res.status(404).json({ message: "댓글 조회에 실패하였습니다." });
  }
  if (!comment) {
    return res.status(400).json({ message: "댓글 내용을 입력해주세요." });
  }
  if (userId === commentOne.userId) {
    await Comments.update(
      { comment: comment },
      { where: { commentId: commentId } }
    );
    res.status(200).json({ message: "댓글을 수정하였습니다." });
  } else {
    return res.status(400).json({ message: "댓글 수정에 실패하였습니다." });
  }
});

// 댓글 삭제 API
router.delete("/:commentId", userMiddleware, async (req, res) => {
  const { commentId } = req.params;
  const { userId } = res.locals.user;

  const commentOne = await Comments.findOne({
    where: { commentId: commentId },
  });
  if (!commentOne) {
    return res.status(404).json({ message: "댓글 조회에 실패하였습니다." });
  }
  if (userId === commentOne.userId) {
    await Comments.destroy({ where: { commentId: commentId } });
    res.status(204).json({ message: "댓글을 삭제하였습니다." });
  } else {
    return res.status(404).json({ message: "댓글 삭제에 실패하였습니다." });
  }
});

module.exports = router;
