
export class ProjectRepository {
  constructor(prisma) {
    this.prisma = prisma;
  }

  /* 프로젝트 생성 */
  createProject = async (
    title,
    description,
    image,
    liveSiteUrl,
    githubUrl,
    category,
    userId
  ) => {
    const project = await this.prisma.projects.create({
      data: {
        title,
        description,
        image,
        liveSiteUrl,
        githubUrl,
        category,
        userId,
      },
    });
    return project;
  };

  /* 프로젝트 목록 조회 */

  getProject = async () => {
    const projects = await this.prisma.projects.findMany({
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
            viewsLogs: true,
            bookmarks: true,
          },
        },
      },

      orderBy: {
        createdAt: "desc",
      },
    });
    return projects;
  };

  /* 프로젝트 상세 조회 */
  getProjectById = async (projectId) => {
    const project = await this.prisma.projects.findFirst({
      where: { id: +projectId },
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
            viewsLogs: true,
            bookmarks: true,
          },
        },
      },
    });
    return project
  };

  /* 프로젝트id 조회 */
  findProject = async (projectId) => {
    
    const project = await this.prisma.projects.findUnique({
      where: {
        id: +projectId,
      },
    });
    
    return project;
  };

  updateProject = async (projectId, title, description, image) => {
    const project = await this.prisma.projects.update({
      where: {
        id: +projectId,
      },
      data: {
        title,
        description,
        image,
      },
    });
    return project;
  };

  /* 프로젝트 삭제 */
  deleteProject = async (projectId, title, description, image) => {
    return await this.prisma.projects.delete({

      where: {
        id: +projectId,
      },

    });
  };

  getProjectByCategory = async (category) => {
    const project = await this.prisma.projects.findMany({
      where: { category },
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
            viewsLogs: true,
            bookmarks: true,
          },
        },
      },
    });

    return project;
  };



  // /* 페이지네이션 */
  // getProjectPage = async (page, perPage) => {
  //   const paginate = await this.prisma.projects.findMany({
  //     skip: (page - 1) * perPage,
  //     take: perPage,
  //     orderBy: {
  //       createdAt: 'desc',
  //     },
  //   });
  //   return paginate;
  // }



  /* 페이지네이션 */
getProjectPage = async(page, perPage) =>{
  const cursor ={
    id : null,
  };
  // 첫번째페이지가 아닌 경우 
  if (page >1){
    // 이전 페이지에서 가져온 마지막 항목의 id 설정
    const previousPage = await this.prisma.projects.findMany({
      take: perPage,  //페이지당 항목수 지정
      orderBy: {
        createdAt : 'desc'  //생성 시간의 내림차순 정렬
      },
      select : {
        id : true,  
      },
      skip : (page -2) *perPage, //이전페이지의 마지막 항목을 가져옴
    });

    if(previousPage.length >0) {
      cursor.id = previousPage[previousPage.length =1].id; //마지막 항목id 를 cursor.id에 설정
    }
  }

  //현재 페이지의 데이터 가져오기
  const currnetPage = await this.prisma.projects.findMany({
    take: perPage,
    cursor : cursor.id ? {id : cursor.id} : undefined,  //cursor.id가 있으면 가져오고 없으면 undefined

    orderBy: {
      createdAt: 'desc', 
    },
  })
  return currnetPage
 }

}
