import { CustomError } from "../errors/customError.js";

export class LikeService {
  constructor(likeRepository) {
    this.likeRepository = likeRepository;
  }

  findProjectById = async (projectId) => {
    const project = await this.likeRepository.findProjectById(projectId);

    if (!project) throw new CustomError(404, "해당 게시글이 존재하지 않습니다")

    return project;
  };

  getLikeById = async (userId) => {
    const like = await this.likeRepository.getLikeById(userId);

    return like;
  };

  updateLike = async (projectId, userId) => {
    let isLike = await this.likeRepository.isLikeExist(projectId, userId);

    if (!isLike) {
      await this.likeRepository.addBookmark(projectId, userId);
    } else {
      await this.likeRepository.deleteBookmark(isLike.id);
    }

    return isLike;
  };
}
