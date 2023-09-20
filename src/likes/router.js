import express from 'express'
import {prisma} from '../utils/prisma/index.js';
import {LikeController} from './controller.js'
import {LikeService} from './service.js'
import {LikeRepository} from './repository.js'
import { validateAccessToken } from '../middlewares/auth.js'


const router = express.Router();


// 인스턴스 생성
const likeRepository = new LikeRepository(prisma);
const likeService = new LikeService(likeRepository)
const likeController = new LikeController(likeService);



/* 좋아요 조회 */
router.get('/:projectId/like', validateAccessToken, likeController.getLike)


/* 좋아요 업데이트 */
router.put('/:projectId/like', validateAccessToken, likeController.updateLike)



export default router