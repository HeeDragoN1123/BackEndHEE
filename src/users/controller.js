import UserService from "./service.js";

export default class UserController {
  userService = new UserService();

  signUp = async (req, res, next) => {
    try {
      const { username, avatarUrl, email, password } = req.body;
      await this.findUser(username);

      const user = this.signUp(username, avatarUrl, email, password)

      res.status(201).json({data: user.username})
    } catch (err) {
      next(err);
    }
  };
}
