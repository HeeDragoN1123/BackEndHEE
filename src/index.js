import express from 'express';
import projectRouter from './projects/router.js';
import userRouter from "../src/users/router.js"


const router = express.Router();


router.use('/', userRouter)
router.use('/post', projectRouter);


export default router