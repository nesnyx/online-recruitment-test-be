import { Queue } from "bullmq";
import { redisConnection } from "../utils/redis-connection";


export const examQueue = new Queue('exam-processing', {
  connection: redisConnection,
});

export const scheduleAutoSubmit = async (userId: string, examId: string, delayMs: number) => {
  const jobId = `auto-submit-${userId}-${examId}`; // ID Unik agar tidak double job untuk user yang sama
  await examQueue.add(
    'auto-submit-action', 
    { userId, examId }, 
    { 
      delay: delayMs,
      jobId: jobId,
      removeOnComplete: true, // Bersihkan jika sudah sukses
      attempts: 3,            // Coba lagi jika worker error (misal DB down)
      backoff: {
        type: 'exponential',
        delay: 1000,
      }
    }
  );
  
  console.log(`[Queue] Job dijadwalkan untuk ${userId} dalam ${delayMs / 1000} detik`);
};