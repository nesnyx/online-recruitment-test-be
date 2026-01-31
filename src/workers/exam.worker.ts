import { Worker, Job } from 'bullmq';
import { redisConnection } from '../utils/redis-connection';
import { userService } from '../container';
import { logger } from '../utils/logger';


const examWorker = new Worker(
    'exam-processing',
    async (job: Job) => {
        const { userId, examId } = job.data;
        logger.info(`[Worker] Memeriksa status ujian untuk User: ${userId}...`);
        const result = await userService.getExamResultsByUserId(userId, examId);

        if (result && result.status === 'ONGOING') {
            logger.info(`[Worker] User ${userId} belum submit. Menjalankan Auto-Submit...`);
            await userService.submitExam(userId, examId);
        } else {
            logger.info(`[Worker] User ${userId} sudah submit manual. Skip.`);
        }
    },
    { connection: redisConnection }
);
examWorker.on('failed', (job, err) => {
    logger.error(`[Worker] Job ${job?.id} gagal: ${err.message}`);
});

export default examWorker