import { Router } from 'express';

import userRoutes from '@/routes/user.routes';
import courseRoutes from '@/routes/course.routes';

import lessonRoutes from '@/routes/lesson.routes';
import testRoutes from '@/routes/test.routes';
import unitRoutes from '@/routes/unit.routes';
import fileRoutes from '@/routes/file.routes';
import questionRoutes from '@/routes/question.routes';

const router = Router();

router.use('/user', userRoutes);
router.use('/course', courseRoutes);
router.use('/unit', unitRoutes);
router.use('/lesson', lessonRoutes);
router.use('/test', testRoutes);
router.use('/file', fileRoutes);
router.use('/question', questionRoutes);


export default router;