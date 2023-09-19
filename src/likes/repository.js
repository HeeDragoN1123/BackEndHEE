

export class LikeRepository {
  constructor(prisma) {
    this.prisma = prisma;
  }

  /* 프로젝트 id  */
  findProjectById = async (projectId) => {
    //projects
    //console.log("!!!!!!!!!!!!!!",projectId) 프로젝트 아이디 제대로 5 나옴
    const like = await this.prisma.likes.findFirst({
      where: { id: +projectId },
    });

    return like;
  };

  /* like 유저 id */
  // like 대소문자 다시확인
  getLikeById = async (userId) => {
    //console.log("@@@@@@@@@@",userId)        유저 아이디 1로 나옴
      // _count 필드 출력
    //   console.log(like[0]._count.Likes,"##################");
    return await this.prisma.likes.findMany({
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
        thumbnail: true,
        category: true,
        viewCount: true,
        likeCount: true,
        isBookmarked: true,
        isLiked: true,
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
  };

  /* 좋아요 / 좋아요 취소 */
  updateLike = async () => {};
}