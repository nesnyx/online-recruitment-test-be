import { CreateAccountType } from "../dto/create-account.dto"
import { CreateScheduleType } from "../dto/create-schedule.dto"



interface IAdminRepository {
    findByID(id: string): Promise<Record<string, any>>
    createAccout(payload: CreateAccountType): Promise<CreateAccountType>
    createSchedule(payload: CreateScheduleType): Promise<CreateScheduleType>
}

export class AdminRepository implements IAdminRepository {
    async findByID(id: string): Promise<Record<string, any>> {
        throw new Error("Method not implemented.")
    }
    async createAccout(payload: CreateAccountType): Promise<CreateAccountType> {
        throw new Error("Method not implemented.")
    }
    async createSchedule(payload: CreateScheduleType): Promise<CreateScheduleType> {
        throw new Error("Method not implemented.")
    }

}