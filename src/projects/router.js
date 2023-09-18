import express from "express";
// //import {prisma} from '../utils/prisma/index.js';
import {ProjectController} from './contoller.js';
//import PostService from "./service.js";
// import PostRepository from "./repository.js";

const router = express.Router();

// const postRepository = new PostRepository(prisma)
// const postService = new PostService(postRepository)
//const postController = new PostController(postService);

 const projectController = new ProjectController();



// /* 게시글 생성 */
 router.post('/', projectController.createProject);
//validate 추가 필요

// /* 게시글 목록 조회 */
router.get('/', projectController.getProject)


/* 게시글 상세 조회 */
router.get('/:postId', projectController.getByIdProject)

/* 게시글 수정 */
router.put('./postId', projectController.updateProject)
//validate 추가 필요

/* 게시글 삭제*/
router.delete('./postId', projectController.deleteProject)


export default router;