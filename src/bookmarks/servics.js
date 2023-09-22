import { CustomError } from "../errors/customError.js";
import { BookmarkRepository } from "./repository.js";

export class BookmarkService {
  bookmarkRepository = new BookmarkRepository();

  findProjectById = async (projectId) => {
    const project = await this.bookmarkRepository.findProjectById(projectId);

    if (!project) throw new CustomError(404, "해당 게시글이 존재하지 않습니다");

    return project;
  };

  updateBookmark = async (projectId, userId) => {
    let isBookmark = await this.bookmarkRepository.isBookMarkExist(projectId, userId);

    if (!isBookmark) {
      await this.bookmarkRepository.addBookmark(projectId, userId);
    } else {
      await this.bookmarkRepository.deleteBookmark(isBookmark.id);
    }

    return isBookmark;
  };

  getUserBookmarkedProject = async (userId) => {
    const projects = await this.bookmarkRepository.getUserBookmarkedProject(userId)

    const project = projects.map((item) => {
      return {
        id: item.id,
        title: item.title,
        thumbnail: item.image,
        category: item.category,
        viewCount: item._count.viewsLogs,
        likeCount: item._count.likes,
        createdAt: item.createdAt,
        authour: {
          id: item.users.id,
          username: item.users.name,
          avatarUrl: item.users.avatarUrl,
        },
      };
    });

    return project
  }
}
