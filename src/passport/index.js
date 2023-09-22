import passport from "passport";
import google from "./googleStrategy.js";
import { prisma } from "../utils/prisma/index.js";

export default () => {
  passport.serializeUser((user, done) => {
    done(null, user.id);
  });

  passport.deserializeUser(async (id, done) => {
    try {
      const user = await prisma.users.findUnique({
        where: { id },
      });
      done(null, user);
    } catch (error) {
      done(error);
    }
  });
  google(); // 구글 전략 등록
};
