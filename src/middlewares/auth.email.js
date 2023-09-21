import nodemailer from "nodemailer";
import jwt from "jsonwebtoken";
import { validateToken } from "./auth.js";
import { userRepository } from "../users/repository.js";
import { asyncHandler } from "./asynchandler.js";
import { CustomError } from "../errors/customError.js";

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
    pass: process.env.PASS,
  },
});

const createEmailVerifyToken = (email) => {
  const token = jwt.sign({ email: email }, process.env.PRIVATE_KEY, {
    expiresIn: "7d",
  });

  return token;
};

const emailAuth = async (req, res) => {
  const { email } = req.body;
  console.log(email)

  const token = createEmailVerifyToken(email);
  console.log(token)

  const mailOptions = {
    from: process.env.SHOOT,
    to: email,
    subject: " 인증 관련 메일 입니다. ",
    html: `<h3>링크를 클릭해서 이메일을 인증하세요</h3>
    <h3> <a href="http://localhost:8080/verifyLink/?email=${email}?token=${token}">이메일 인증하기</a></h3>
    <h3>1시간 뒤 링크가 만료됩니다</h3>`,
  };
  smtpTransport.sendMail(mailOptions, (err, response) => {
    //첫번째 인자는 위에서 설정한 mailOption을 넣어주고 두번째 인자로는 콜백함수.
    if (err) {
      res.json({ ok: false, msg: " 메일 전송에 실패하였습니다. " });
      smtpTransport.close(); //전송종료
      return;
    } else {
      console.log(response)
      res.json({
        ok: true,
        msg: " 메일 전송에 성공하였습니다. ",
      });
      smtpTransport.close(); //전송종료
      return;
    }
  });
};

const verifyLink = asyncHandler(async (req, res) => {
  const token = req.query.token;

  const { email } = validateToken(token, process.env.PRIVATE_KEY);
  console.log(email);

  if (!email) throw new CustomError(412, "이메일 정보가 올바르지 않습니다");

  const isEmailVerified = await userRepository.updateIsEmailVerified(email);
  console.log(isEmailVerified)

  if (!isEmailVerified) {
    throw new CustomError(412, "이메일이 존재하지 않습니다");
  } else {
    res.status(200).json("이메일 인증 성공");
  }
});

export { emailAuth, verifyLink };
