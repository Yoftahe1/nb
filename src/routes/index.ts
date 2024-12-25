import { Router } from 'express';

import userRoutes from './user.routes';
import courseRoutes from './course.routes';

import lessonRoutes from './lesson.routes';
import testRoutes from './test.routes';
import unitRoutes from './unit.routes';

const router = Router();

router.use('/user', userRoutes);
router.use('/course', courseRoutes);
router.use('/unit', unitRoutes);
router.use('/lesson', lessonRoutes);
router.use('/test', testRoutes);


export default router;