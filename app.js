const express = require("express");
require("dotenv").config();
const router = require("./routes");
const app = express();

const cookieParser = require("cookie-parser");
app.use(cookieParser());
app.use(express.json());
app.use("/api", router);

app.listen(3011, () => {
  console.log(3011, "포트로 서버가 열렸어요!");
});
