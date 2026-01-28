
import { AppError } from "../../../utils/app-error";
import { IExam } from "../repository/admin.exam.repository";
import { IUser } from "../repository/admin.user.repository";
import { eventBus } from "../../../utils/event-bus";

export class SendInvitationService {
    constructor(private readonly adminExamRepository: IExam, private readonly adminUserRepository: IUser) { }

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
        eventBus.emit("admin.send-invitation", {
            exam,
            users,
            userIds,
            examId,
            missingCount
        });


        return {
            message: "Proses pengiriman undangan sedang berjalan di background.",
            estimatedCandidates: users.length
        };
    }
}