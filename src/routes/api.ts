// [IMPORT_ROUTE_START]
import { Hono } from 'hono';
import projectRoute from '@/modules/project/route';

// [IMPORT_ROUTE_END]

const apiApp = new Hono().basePath('/api');

// [ROUTE_REGISTRATION_START]
apiApp.route('/projects', projectRoute);
// [ROUTE_REGISTRATION_END]

export default apiApp;
