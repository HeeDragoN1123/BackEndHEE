import express from "express";
import {prisma} from '../utils/prisma/index.js';
import {ProjectController} from './controller.js';
import {ProjectService} from "./service.js";
import {ProjectRepository} from "./repository.js";
import { validateAccessToken } from "../middlewares/auth.js"


const router = express.Router();

// 인스턴스 생성
const projectRepository = new ProjectRepository(prisma);
const projectService = new ProjectService(projectRepository)
const projectController = new ProjectController(projectService);

// /* 게시글 생성 */

router.post('/', validateAccessToken, projectController.createProject);


// /* 게시글 목록 조회 */
router.get('/', projectController.getProject)

/* 게시글 상세 조회 */
router.get('/:projectId', projectController.getProjectById)

/* 게시글 수정 */
router.put('/:projectId', validateAccessToken, projectController.updateProject)

/* 게시글 삭제*/

router.delete('/:projectId', validateAccessToken, projectController.deleteProject)


/* 카테고리별 게시글 조회 */
router.get("/category/:categoryId", projectController.getProjectByCategory)

export default router;