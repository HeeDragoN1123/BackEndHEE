import express from 'express';
import projectRouter from './projects/router.js';
import userRouter from "../src/users/router.js"
import likeRouter from './likes/router.js'

const router = express.Router();

router.use('/', userRouter)
router.use('/user', userRouter)
router.use('/project', [projectRouter, likeRouter]);

export default router