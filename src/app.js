import express from "express";
import router from "./index.js";
import dotenv from "dotenv";
import { errorhandler } from "./middlewares/errorhandler.js";
import cors from "cors"
import log from "./middlewares/log.js";
import cookieParser from "cookie-parser";

dotenv.config();

const app = express();
const port = process.env.PORT;

app.use(cors())
app.use(log);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

app.get("/", (req, res) => {
  res.send("hi");
});
app.use("/api", router);
app.use((req, res, next) => {
  res.status(404).send("Not Found");
});
app.use(errorhandler);

app.listen(port, () => {
  console.log(port, "번 서버가 열렸습니다");
});
