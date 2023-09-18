//import {ProjectService} from './service.js'


export  class ProjectController {
constructor(projectService){
 this.projectService = projectService;
}


 /* 프로젝트 생성 */
 createProject = async(req,res,next) =>{
    //const userId = req.user.id;
    const {title, description, image, liveSiteUrl, githubUrl, category} = req.body;

    const project = await this.projectService.createProject(
        
        title,
        description,
        image,
        liveSiteUrl,
        githubUrl,
        category,
        userId,
      );

      return res.status(201).json({project});
 }


 /* 프로젝트 목록 조회 */
 getProject = async(req,res,next) =>{

    const project = await this.projectService.getProject();

    return res.status(200).json({project});
}


/* 프로젝트 상세 조회 */
getByIdProject = async(req,res,next) =>{
    const {projectId} = req.params  // 이거 projectId 로 바꿔야하나?
   
    const project = await this.projectService.getByIdProject(projectId);

    return res.status(200).json({project});

 }
 


/* 프로젝트 수정 */
updateProject = async(req,res,next) =>{
    
    const {projectId} =req.params;  
    //const {id} = req.user;
    const {title, description, image} = req.body;

    const project = await this.projectService.updateProject(projectId, title , description , image, userId);
                                                                                        // 유저id 임의임력
    console.log("###########", projectId)
    return res.status(200).json({ project });
}




 /* 프로젝트 삭제 */
 deleteProject = async(req,res,next) =>{
    const {projectId} = req.params;
    //const {id} = req.user;           

    const project = await this.projectService.deleteProject(projectId , userId)
                                                                // 유저id 임의임력
    return res.status(200).json({ project });
 }

    
}


