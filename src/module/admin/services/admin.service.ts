import { CreateAccountType } from "../dto/create-account.dto";
import { CreateScheduleType } from "../dto/create-schedule.dto";
import { AdminRepository } from "../entity/admin.entity";

export class AdminService {
    constructor(private adminRepository: AdminRepository) { }

    async findByID(id: string): Promise<Record<string, any>> {
        return await this.adminRepository.findByID(id)
    }

    async createAccout(payload: CreateAccountType): Promise<CreateAccountType> {
        return await this.adminRepository.createAccout(payload)
    }

    async createSchedule(payload: CreateScheduleType): Promise<CreateScheduleType> {
        return await this.adminRepository.createSchedule(payload)
    }
}