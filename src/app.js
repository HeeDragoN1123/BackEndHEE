import express from "express";
import router from "./index.js";
import dotenv from "dotenv";
import { errorhandler } from "./middlewares/errorhandler.js";
import cors from "cors"
import log from "./middlewares/log.js";
import cookieParser from "cookie-parser";
import session from "express-session";
import passport from "passport";
import passportConfig from "./passport/index.js";


dotenv.config();

const app = express();
passportConfig();

app.use(express.static('public')); 
app.get('/favicon.ico', (req, res) => {
  res.sendFile(__dirname + '/public/favicon.ico'); 
});

const port = process.env.PORT;

app.use(cors())
app.use(log);
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(session({
  resave: false,
  saveUninitialized: false,
  secret: process.env.COOKIE_SECRET,
  cookie: {
    httpOnly: true,
    secure: false,
  },
}));
app.use(passport.initialize());
app.use(passport.session())

app.get("/", (req, res) => {
  res.send("hi");
});

app.use("/api", router);

app.use((req, res, next) => {
  const error =  new Error(`${req.method} ${req.url} 라우터가 없습니다.`);
  error.status = 404;
  next(error);
});
app.use(errorhandler);

app.listen(port, () => {
  console.log(port, "번 서버가 열렸습니다");
});
