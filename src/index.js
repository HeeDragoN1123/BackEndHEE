import express from 'express';
import projectRouter from './projects/router.js';


const router = express.Router();



 router.use('/post', projectRouter);


export default router