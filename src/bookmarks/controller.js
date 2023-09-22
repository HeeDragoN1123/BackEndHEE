
import { BookmarkService } from "./servics.js";

export class BookmarkController {
  bookmarkService = new BookmarkService();

  updateBookmark = async (req, res, next) => {
    try {
      const { projectId } = req.params;
      console.log(projectId)
      const userId = req.user.id;

      await this.bookmarkService.findProjectById(projectId);
      let isBookmarkExist = await this.bookmarkService.updateBookmark(
        projectId,
        userId
      );

      if (isBookmarkExist) {
        return res.status(200).json({ message: "북마크 취소" });
      } else {
        return res.status(200).json({ message: `북마크 등록` });
      }
    } catch (err) {
      next(err);
    }
  };

  getUserBookmarkedProject = async (req, res, next) => {
    try {
      const { userId } = req.params;
      const projects = await this.bookmarkService.getUserBookmarkedProject(userId);

      return res.status(200).json(projects);
    } catch (err) {
      next(err);
    }
  };
}

