import pLimit from "p-limit";
import { eventBus } from "../../../utils/event-bus";
import { AdminExamAccountService } from "./admin.exam-account.service";
import { sendExamInvitation } from "../../../utils/email-gateway";

export class EventListener {
    constructor(private readonly adminExamAccountService: AdminExamAccountService) { }

    async withRetry<T>(fn: () => Promise<T>, retries = 3, delay = 1000): Promise<T> {
        try {
            return await fn();
        } catch (error) {
            if (retries <= 0) throw error;
            await new Promise(resolve => setTimeout(resolve, delay));
            return this.withRetry(fn, retries - 1, delay * 2); 
        }
    }
    
    async handleSendInvitationEvent() {
        eventBus.on("admin.send-invitation", async (payload) => {
            try {
                const { exam, users, examId, userIds, missingCount } = payload;
                const limit = pLimit(5);
                console.log(`[Background] Memulai pengiriman email untuk ${users.length} user...`);
                const emailPromises = users.map((user: any) => {
                    return limit(async () => {
                        await this.adminExamAccountService.createExamAccounts(user.id, examId)
                        return sendExamInvitation(
                            user.email,
                            user.name,
                            exam.title,
                            user.username,
                            user.password,
                            exam.startAt,
                            exam.endAt,
                            Number(exam.durationMinutes)
                        );
                    });
                });
                const results = await Promise.allSettled(emailPromises);
                const successCount = results.filter(r => r.status === 'fulfilled').length;
                const failedCount = results.length - successCount;
                const sendEmail = {
                    totalRequested: userIds.length,
                    totalFound: users.length,
                    successCount,
                    failedCount,
                    missingInDb: missingCount,
                    results: results.map(r => r.status)
                }
                console.log(`[Background] Selesai! Berhasil: ${sendEmail.successCount}, Gagal: ${sendEmail.failedCount}, Tidak Ditemukan: ${sendEmail.missingInDb}`);
            } catch (error) {
                console.error("Error handling send-invitation event:", error);
            }
        });
    }
}