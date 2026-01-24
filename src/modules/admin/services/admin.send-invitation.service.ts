import pLimit from "p-limit";
import { AppError } from "../../../utils/app-error";
import { sendExamInvitation } from "../../../utils/email-gateway";
import { IExam } from "../repository/admin.exam.repository";
import { IUser } from "../repository/admin.user.repository";
import { AdminExamAccountService } from "./admin.exam-account.service";

export class SendInvitationService {
    constructor(private readonly adminExamRepository : IExam, private readonly adminUserRepository : IUser,private readonly adminExamAccounService : AdminExamAccountService) { }

    private retry = async (fn: () => Promise<any>, retries = 3, delay = 2000): Promise<any> => {
        try {
            return await fn();
        } catch (error) {
            if (retries <= 0) throw error;
            await new Promise(resolve => setTimeout(resolve, delay));
            return this.retry(fn, retries - 1, delay * 2);
        }
    };
    async sendInvitation(examId: string, userIds: string[]) {
        const [exam, users] = await Promise.all([
            this.adminExamRepository.findExamByID(examId),
            this.adminUserRepository.findUsersByIds(userIds)
        ]);
        if (!exam) throw new AppError("Ujian tidak ditemukan", 404);
        if (users.length === 0) throw new AppError("Daftar user kosong", 400);
        const missingCount = userIds.length - users.length;
        const limit = pLimit(5);
        const emailPromises = users.map(user => {
            return limit(async () => {
                await this.adminExamAccounService.createExamAccounts(user.id, examId)
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
        return {
            totalRequested: userIds.length,
            totalFound: users.length,
            successCount,
            failedCount,
            missingInDb: missingCount,
            results: results.map(r => r.status)
        };
    }
}