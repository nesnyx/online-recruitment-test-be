import { Worker, Job } from 'bullmq';
import { redisConnection } from '../utils/redis-connection';
import { userService } from '../container';
import { logger } from '../utils/logger';


const examWorker = new Worker(
    'exam-processing',
    async (job: Job) => {
        const { userId, examId } = job.data;
        logger.info(`[Worker] Check Status for User with ID` ,{userId});
        const result = await userService.getExamResultsByUserId(userId, examId);

        if (result && result.status === 'ONGOING') {
            logger.info(`[Worker] User has not submitted. run Auto-Submit...` ,{
                userId, examId
            });
            await userService.submitExam(userId, examId);
        } else {
            logger.info(`[Worker] User has submitted. Skip.`,{
                userId, examId
            });
        }
    },
    { connection: redisConnection }
);
examWorker.on('failed', (job, err) => {
    logger.error(`[Worker] Job Failed: ${job?.id}`, { error: err.message });
});

export default examWorker