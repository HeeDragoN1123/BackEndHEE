/**
 * @function
 * @param {function} fn -비동기 함수
 * @returns {function} - 미들웨어 함수 반환
 */

export const asyncHandler = (fn) => {
  return async (req, res, next) => {
    try {
      await fn(req, res, next);
    } catch (err) {
      next(err);
    }
  };
};
