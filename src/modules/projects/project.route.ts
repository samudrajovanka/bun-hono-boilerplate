import { Hono } from 'hono';
import { createProject, getProjects } from './project.controller';

const projectRoute = new Hono();

projectRoute.get('/', ...getProjects);
projectRoute.post('/', ...createProject);

export default projectRoute;
