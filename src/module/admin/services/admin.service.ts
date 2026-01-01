import { CreateAccountType } from "../dto/create-account.dto";
import { CreateScheduleType } from "../dto/create-schedule.dto";
import { IAdminRepository } from "../entity/admin.entity";



export class AdminService {
    constructor(private adminRepository: IAdminRepository) { }

    async findByID(id: string): Promise<Record<string, any>> {
        return await this.adminRepository.findByID(id)
    }

    async createUserAccount(payload: CreateAccountType): Promise<CreateAccountType> {
        return await this.adminRepository.createUserAccount(payload)
    }

    async createSchedule(payload: CreateScheduleType): Promise<CreateScheduleType> {
        return await this.adminRepository.createSchedule(payload)
    }
}