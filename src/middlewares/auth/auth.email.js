import nodemailer from "nodemailer";
import jwt from "jsonwebtoken";
import { validateToken } from "./auth.js";

const smtpTransport = nodemailer.createTransport({
  pool: true,
  maxConnection: 1,
  service: "naver",
  host: "smtp@naver.com",
  port: 587,
  secure: false,
  requireTLS: true,
  auth: {
    user: process.env.USER,
    pass: process.env.PASS
  },
});

const createEmailVerifyTokne = (email) => {
  const token = jwt.sign({ name: email }, process.env.PRIVATE_KEY, {
    expiresIn: "1h",
  });
  console.log(token);
  return token;
};

const emailAuth = async (req, res) => {
  const { email } = req.body;

  const token = createEmailVerifyTokne(email);

  const mailOptions = {
    from: "ehdxka3@naver.com ",
    to: email,
    subject: " 인증 관련 메일 입니다. ",
    html: `<p>Please click the following link to verify your email address:</p>
    <p> <a href="http://localhost:8080/verifyLink/?email=${email}?token=${token}">Verify email</a></p>
    <p>This link will expire on ${token.expiresIn}.</p>`,
  };
  smtpTransport.sendMail(mailOptions, (err, response) => {
    console.log("response", response);
    //첫번째 인자는 위에서 설정한 mailOption을 넣어주고 두번째 인자로는 콜백함수.
    if (err) {
      res.json({ ok: false, msg: " 메일 전송에 실패하였습니다. " });
      smtpTransport.close(); //전송종료
      return;
    } else {
      res.json({
        ok: true,
        msg: " 메일 전송에 성공하였습니다. ",
      });
      smtpTransport.close(); //전송종료
      return;
    }
  });
};

const verifyToken = async (req, res) => {
  const token = req.query.token;
  const email = req.query.email;
  console.log("email", email);
  console.log("token", token);
  const answer = validateToken(token, process.env.PRIVATE_KEY);

  if (answer) {
    res.json("이메일 인증에 성공했습니다");
  } else {
    res.json("이메일 인증에 실패했습니다");
  }
};

export { emailAuth, verifyToken };
