
import { validateAccessToken } from "../middlewares/auth.js";
import { BookmarkController } from "./controller.js";
import express from "express"

const router = express.Router()

const bookmarkController = new BookmarkController()

/* 북마크 기능 */
router.put("/:projectId/bookmark", validateAccessToken, bookmarkController.updateBookmark)

/* 북마크한 프로젝트 조회 */
router.get("/:userId/bookmark", validateAccessToken, bookmarkController.getUserBookmarkedProject)

export default router

