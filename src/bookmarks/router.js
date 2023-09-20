import express from 'express'
import {prisma} from '../utils/prisma/index.js';
import {BookmarkController} from './controller.js'
import {BookmarkService} from './service.js'
import {BookmarkRepository} from './repository.js'
import { validateAccessToken } from '../middlewares/auth.js'


const router = express.Router();


// 인스턴스 생성
const bookmarkRepository = new BookmarkRepository(prisma);
const bookmarkService = new BookmarkService(bookmarkRepository)
const bookmarkController = new BookmarkController(bookmarkService);


/* 북마크 조회 */
router.get('/:projectId/bookmark', validateAccessToken, bookmarkController.getBookmark)



/* 북마크 업데이트 */
router.put('/:projectId/bookmark', validateAccessToken, bookmarkController.updateBookmark)



export default router