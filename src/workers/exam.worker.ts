import { Worker, Job } from 'bullmq';
import { redisConnection } from '../utils/redis-connection';
import { userService } from '../container';


const examWorker = new Worker(
    'exam-processing',
    async (job: Job) => {
        const { userId, examId } = job.data;
        console.log(`[Worker] Memeriksa status ujian untuk User: ${userId}...`);
        const result = await userService.getExamResultsByUserId(userId, examId);

        if (result && result.status === 'ONGOING') {
            console.log(`[Worker] User ${userId} belum submit. Menjalankan Auto-Submit...`);
            await userService.submitExam(userId, examId);
        } else {
            console.log(`[Worker] User ${userId} sudah submit manual. Skip.`);
        }
    },
    { connection: redisConnection }
);
examWorker.on('failed', (job, err) => {
    console.error(`[Worker] Job ${job?.id} gagal: ${err.message}`);
});

export default examWorker