import { CreateExamType } from "../dto/create-exam.dto";
import { UpdateExamType } from "../dto/update-exam.dto";
import { IExam } from "../repository/admin.exam.repository";
import { IPosition } from "../repository/admin.position.repository";

export class AdminExamService {
    constructor(private readonly adminExamRepository : IExam, private readonly adminPositionRepository : IPosition){}

     async findExamByID(id: string) {
            return await this.adminExamRepository.findExamByID(id)
        }
    
        async createExam(payload: CreateExamType) {
            await this.adminPositionRepository.findPositionById(payload.categoryId)
            return await this.adminExamRepository.createExam(payload)
        }
    

        async getAllExams() {
            const exams = await this.adminExamRepository.findAllExams()
            return exams.map((exam: any) => ({
                id: exam.id,
                title: exam.title,
                description: exam.description,
                durationMinutes: exam.durationMinutes,
                positionId: exam.positionId,
                category: exam.Position?.name ?? null,
                startAt: exam.startAt,
                endAt: exam.endAt,
                totalQuestions: exam.totalQuestions || exam.getDataValue('totalQuestions') || 0,
            }))
        }
    
       
    
        async updateExam(examId: string, payload: UpdateExamType) {
            return await this.adminExamRepository.updateExamById(examId, payload)
        }

        async deleteExamById(id : string) {
        return await this.adminExamRepository.deleteExamById(id)
    }
}