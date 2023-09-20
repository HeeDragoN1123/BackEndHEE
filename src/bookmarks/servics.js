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
    let isBookmark = await this.likeRepository.isBookMarkExist(projectId, userId);

    if (!isBookmark) {
      await this.likeRepository.addLike(projectId, userId);
    } else {
      await this.likeRepository.deleteLike(isBookmark.id);
    }

    return isBookmark;
  };
}
