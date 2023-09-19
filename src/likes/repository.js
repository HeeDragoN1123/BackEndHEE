
export class LikeRepository {
  constructor(prisma) {
    this.prisma = prisma;
  }

  /* 프로젝트 id  */
  findProjectById = async (projectId) => {
    const like = await this.prisma.likes.findFirst({
      where: { id: +projectId },
    });

    return like;
  };

  /* 좋아요 찾기 */
  getLikeById = async (userId) => {
    const project = await this.prisma.projects.findMany({
      where: {
        likes: {
          some: {
            id: +userId,
          },
        },
      },

      select: {
        id: true,
        title: true,
        image: true,
        category: true,
        createdAt: true,
        users: {
          select: {
            id: true,
            name: true,
            avatarUrl: true,
          },
        },
        _count: {
          select: {
            likes: true,
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    });
    return project;
  };

  /* 좋아요 / 좋아요 취소 */

  isLike = async (projectId, userId) => {
    const like = await this.prisma.likes.findFirst({
      where: { projectId: +projectId, userId: +userId },
    });
    return like;
  };

  addLike = async (projectId, userId) => {
    const like = await this.prisma.likes.create({
      data: { projectId: +projectId, userId: +userId },
    });
    return like;
  };


  deleteLike = async (likeId) => {
    const like = await this.prisma.likes.delete({
      where: { id: +likeId },
    });

    return like;
  };

}
