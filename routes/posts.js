const router = require("express").Router();
const userMiddleware = require("../middlewares/user-middleware");
const { Posts, Users } = require("../models");

// 게시글 목록 조회 API
router.get("/", async (req, res) => {
  const posts = await Posts.findAll({ include: [Users] });
  const result = posts.map((post) => {
    return {
      postId: post.postId,
      userId: post.userId,
      nickname: post.User.nickname,
      title: post.title,
      createdAt: post.createdAt,
      updatedAt: post.updatedAt,
    };
  });
  res.status(200).json({ data: result });
});

// 게시글 상세 조회 API
router.get("/:postId", async (req, res) => {
  const { postId } = req.params;
  const posts = await Posts.findOne({ where: { postId: postId } });
  if (!posts) {
    return res.status(400).send({
      message: "데이터 형식이 올바르지 않습니다.",
    });
  }
  const result = {
    postId: posts.postId,
    userId: posts.userId,
    nickname: posts.nickname,
    title: posts.title,
    content: posts.content,
    createdAt: posts.createdAt,
    updatedAt: posts.updatedAt,
  };
  res.status(200).json({ data: result });
});

// 게시글 작성 API

router.post("/", userMiddleware, async (req, res) => {
  const { title, content } = req.body;
  const { userId } = res.locals.user;
  if (!title || !content) {
    return res.status(400).send({
      message: "데이터 형식이 올바르지 않습니다.",
    });
  }

  await Posts.create({ userId, title, content });

  res.status(201).json({ message: "게시글을 생성하였습니다." });
});

// 게시글 수정 API
router.patch("/:postId", userMiddleware, async (req, res) => {
  const { postId } = req.params;
  const { title, content } = req.body;
  const { userId } = res.locals.user;

  const post = await Posts.findOne({ where: { postId: postId } });
  if (userId === post.userId) {
    await Posts.update(
      {
        title: title,
        content: content,
      },
      {
        where: {
          postId: postId,
        },
      }
    );
    res.status(200).json({ message: "게시글 수정에 성공하였습니다." });
  } else {
    return res.status(404).json({ message: "게시글 수정이 실패하였습니다." });
  }
});

// 게시글 삭제 API
router.delete("/:postId", userMiddleware, async (req, res) => {
  const { postId } = req.params;
  const { userId } = res.locals.user;

  const post = await Posts.findOne({ where: { postId: postId } });

  if (userId === post.userId) {
    await Posts.destroy({
      where: {
        postId: postId,
      },
    });
    res.status(204).json({ message: "게시글을 삭제하였습니다." });
  } else {
    return res.status(404).json({ message: "게시글 삭제에 실패하였습니다." });
  }
});

module.exports = router;
