const router = require("express").Router();
const postsRouter = require("./posts.js");
const commentsRouter = require("./comments.js");
const loginRouter = require("./login.js");
const signUpRouter = require("./signup.js");
const likesRouter = require("./likes.js");

router.use("/posts", postsRouter);
router.use("/comments", commentsRouter);
router.use("/login", loginRouter);
router.use("/signup", signUpRouter);
router.use("/likes", likesRouter);

module.exports = router;
