import { Hono } from 'hono';
import { createProject, getProjects } from './controller';

const projectRoute = new Hono();

projectRoute.get('/', ...getProjects);
projectRoute.post('/', ...createProject);

export default projectRoute;
