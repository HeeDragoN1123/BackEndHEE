import {UserService} from "./service.js";

export class UserController {
  userService = new UserService();

  signUp = async (req, res, next) => {
    try {
      const { name, avatarUrl, email, password, description, githubUrl, linkedinUrl } = req.body;
      await this.userService.findUserByName(name)
      await this.userService.findUserByEmail(email)
      
      const data = await this.userService.signUp(name, avatarUrl, email, password, description, githubUrl, linkedinUrl)
      console.log(data)

      res.status(201).json({message: data})
    } catch (err) {
      next(err);
    }
  };

}
