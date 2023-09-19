//import {prisma} from '../utils/prisma/index.js'

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
    thumbnail,
    userId,
    
  ) => {
    //console.log("!!!!!!!!!",userId)
    return await this.prisma.projects.create({
      data: {
        title,
        description,
        image,
        liveSiteUrl,
        githubUrl,
        category,
        thumbnail,
        userId,
        
      },
    });
  };

  /* 프로젝트 목록 조회 */

  getProject = async () => {
    return await this.prisma.projects.findMany({
      select: {
        id: true,
        title: true,
        thumbnail: true,
        category: true,
        // viewCount : true,  어드밴스드
        //likeCount: true,
        //isBookmarked: true,
        //isLiked: true,
        createdAt: true,
        users: {
          select: {
            id: true,
            name: true,
            avatarUrl: true,
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    });
  };

  /* 프로젝트 상세 조회 */
  getByIdProject = async (id) => {
   
    return await this.prisma.projects.findFirst({
        where: {id},
      select: {
        id: true,
        title: true,
       // thumbnail: true,
        category: true,
        // viewCount : true,  어드밴스드
        //likeCount: true,
       // isBookmarked: ture,
       // isLiked: true,
        createdAt: true,
        users: {
          select: {
            id: true,
            name: true,
            avatarUrl: true,
          },
        },
      },
    });
  };


/* 프로젝트id 조회 */
  findProject = async(projectId) =>{
   // console.log("@@@@@@@@@@", typeof projectId)
    const project =  await this.prisma.projects.findUnique({
        where : {
            id : projectId,
        },
    });
    //console.log("##########", project)
    return project
  };


  /* 프로젝트 수정 */
  updateProject = async(projectId, title , description , image) =>{
   // console.log("%%%%%%%%", projectId)
    const project = await this.prisma.projects.update({
        where : {
            id: projectId,
         },
        data : {
        title,
        description,
        image,
    },

});
   // console.log("$$$$$$$$", project)
    return project;
  };


  /* 프로젝트 삭제 */
  deleteProject = async(projectId, title , description , image) =>{
    return await this.prisma.projects.delete({
        where : {
            id: projectId,
        },
    });
  };


}
