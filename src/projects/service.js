import { CustomError } from "../errors/customError.js";console

export class ProjectService {


constructor(projectRepository){
this.projectRepository = projectRepository
}

/* 프로젝트 생성 */
createProject = async(title ,description, image, liveSiteUrl,githubUrl,category,thumbnail,  userId  )  =>{
    return await this.projectRepository.createProject(
     
        title,
        description,
        image,
        liveSiteUrl,
        githubUrl,
        category,
        thumbnail,
        userId,
    );

};

/* 프로젝트 목록 조회 */
getProject = async() =>{

return await this.projectRepository.getProject();

}


/* 프로젝트 상세 조회 */
getByIdProject = async(projectId) =>{
    const project = await this.projectRepository.getByIdProject(projectId)
    // return await this.projectRepository.getByIdProject(+projectId);
    if(!project) {
        throw new CustomError(404, "게시글이 존재하지 않습니다.")
    }

    return await this.projectRepository.getByIdProject(projectId)
}

/* 프로젝트 수정 */
updateProject = async(projectId, title , description , image, userId) =>{
   const project = await this.projectRepository.findProject(projectId);

    if(!project){
    throw new CustomError(404, "게시글이 존재하지 않습니다.");
   }
   if(project.userId !== userId){
    throw new CustomError(403, "게시글 수정 권한이 존재하지 않습니다.")
   }

   return await this.projectRepository.updateProject(projectId, title , description, image);
}


/* 프로젝트 삭제 */
deleteProject = async(projectId, userId) =>{
    const project = await this.projectRepository.findProject(projectId);
   
    if(!project){
    throw new CustomError(404, "게시글이 존재하지 않습니다.");
   }
   if(project.userId !== userId){
    throw new CustomError(403, "게시글 삭제 권한이 존재하지 않습니다.")
   }
    return await this.projectRepository.deleteProject(projectId);
 }

}
