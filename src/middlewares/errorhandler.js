import { CustomError } from "../errors/customError.js";

export function errorhandler (err, req, res, next) {
    console.error(`${req.method} ${req.originalUrl} : ${err}`)

  if (err instanceof CustomError) {
    return res.status(err.status).json({ errorMessage: err.message })
  };

  if (err.name === 'ValidationError') { // joi의 validationError
    return res.status(412).json({ errorMessage: err.details[0].message })
  };
  
  return res.status(500).json({ errorMessage: '서버 내부 에러가 발생했습니다.' });
};