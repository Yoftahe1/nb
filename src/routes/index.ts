import { Router } from 'express';

import userRoutes from './user.routes';
import courseRoutes from './course.routes';

import lessonRoutes from './lesson.routes';
import testRoutes from './test.routes';
import unitRoutes from './unit.routes';
import fileRoutes from './file.routes';
import questionRoutes from './question.routes';

const router = Router();

router.use('/user', userRoutes);
router.use('/course', courseRoutes);
router.use('/unit', unitRoutes);
router.use('/lesson', lessonRoutes);
router.use('/test', testRoutes);
router.use('/file', fileRoutes);
router.use('/question', questionRoutes);


export default router;