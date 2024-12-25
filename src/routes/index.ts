import { Router } from 'express';

import userRoutes from '@/routes/user.routes';
import courseRoutes from '@/routes/course.routes';

import lessonRoutes from '@/routes/lesson.routes';
import testRoutes from '@/routes/test.routes';
import unitRoutes from '@/routes/unit.routes';

const router = Router();

router.use('/user', userRoutes);
router.use('/course', courseRoutes);
router.use('/unit', unitRoutes);
router.use('/lesson', lessonRoutes);
router.use('/test', testRoutes);


export default router;