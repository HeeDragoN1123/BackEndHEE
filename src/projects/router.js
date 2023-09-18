import express from "express";
import {prisma} from '../utils/prisma/index.js';
import {ProjectController} from './controller.js';
import {ProjectService} from "./service.js";
import {ProjectRepository} from "./repository.js";

const router = express.Router();

// 인스턴스 생성
const projectRepository = new ProjectRepository(prisma);
const projectService = new ProjectService(projectRepository)
const projectController = new ProjectController(projectService);



// /* 게시글 생성 */
 router.post('/', projectController.createProject);
//validate 추가 필요

// /* 게시글 목록 조회 */
router.get('/', projectController.getProject)

/* 게시글 상세 조회 */
router.get('/:projectId', projectController.getByIdProject)

/* 게시글 수정 */
router.put('/:projectId', projectController.updateProject)
//validate 추가 필요

/* 게시글 삭제*/
router.delete('/:projectId', projectController.deleteProject)


export default router;