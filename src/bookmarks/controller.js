import { BookmarkService } from "./servics.js";

export class BookmarkController {
  bookmarkService = new BookmarkService();

  updateBookmark = async () => {
    try {
      const { projectId } = req.params;
      const userId = req.user.id;

      await this.BookmarkService.findProjectById(projectId);
      let isBookmarkExist = await this.likeService.updateBookmark(
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

      const projects = await this.userService.getUserLikedProject(userId);

      console.log(projects);

      return res.status(200).json(projects);
    } catch (err) {
      next(err);
    }
  };
}
