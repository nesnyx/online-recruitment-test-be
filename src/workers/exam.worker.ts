import { UserService } from "../modules/user/services/user.service";
import { ConnectionOptions } from 'bullmq';
import { Worker, Job } from 'bullmq';
import { logger } from '../utils/logger';

export class ExamWorker {
    constructor(private readonly userService: UserService, private readonly redisConnection: ConnectionOptions) {
    }
    async submitExamWorker() {
        const examWorker = new Worker(
            'exam-processing',
            async (job: Job) => {
                const { userId, examId } = job.data;
                logger.info(`[Worker] Check Status for User with ID`, { userId });
                const result = await this.userService.getExamResultsByUserId(userId, examId);

                if (result && result.status === 'ONGOING') {
                    logger.info(`[Worker] User has not submitted. run Auto-Submit...`, {
                        userId, examId
                    });
                    await this.userService.submitExam(userId, examId);
                } else {
                    logger.info(`[Worker] User has submitted. Skip.`, {
                        userId, examId
                    });
                }
            },
            { connection: this.redisConnection }
        );
        examWorker.on('failed', (job, err) => {
            logger.error(`[Worker] Job Failed: ${job?.id}`, { error: err.message });
        });
    }

}