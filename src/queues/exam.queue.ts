import { Queue } from "bullmq";
import { redisConnection } from "../utils/redis-connection";
import { logger } from "../utils/logger";


export const examQueue = new Queue('exam-processing', {
  connection: redisConnection,
});

export const scheduleAutoSubmit = async (userId: string, examId: string, delayMs: number) => {
  const jobId = `auto-submit-${userId}-${examId}`; 
  await examQueue.add(
    'auto-submit-action',
    { userId, examId },
    {
      delay: delayMs,
      jobId: jobId,
      removeOnComplete: true, 
      removeOnFail:true,
      keepLogs:0,
      attempts: 3,            
      backoff: {
        type: 'exponential',
        delay: 1000,
      }
    }
  );

  logger.info(`[Queue] Job dijadwalkan untuk ${jobId} dalam ${delayMs / 1000} detik`, {
    jobId,
    userId,
    examId,
    delayMs
  });
};