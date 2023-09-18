import Joi from "joi";

const re_email = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
const re_password = /^[a-zA-Z0-9]{4,30}$/;

const signUpSchema = Joi.object({
  name: Joi.string().min(3).required(),
  avatarUrl: Joi.string().min(3).required(),
  email: Joi.string().pattern(re_email).required(),
  password: Joi.string().pattern(re_password).required(),
  description: Joi.string().min(3).max(50).required(),
  githubUrl: Joi.string().pattern(re_email).required(),
  linkedinUrl: Joi.string().pattern(re_email).required(),
});

const loginSchema = Joi.object({
  name: Joi.string().min(3).required(),
  password: Joi.string().pattern(re_password).required(),
});

export { signUpSchema, loginSchema };
