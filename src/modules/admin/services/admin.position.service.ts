import { IPosition } from "../repository/admin.position.repository";

export class AdminPositionService {
    constructor(private readonly adminPositionRepository : IPosition){}

    async createPosition(name: string) {
        return await this.adminPositionRepository.createPosition(name)
    }
    async getAllPositions() {
        return await this.adminPositionRepository.findPositions()
    }
    async getPositionById(id: string) {
        return await this.adminPositionRepository.findPositionById(id)
    }

    async deletePositionById(id: string) {
        return await this.adminPositionRepository.deletePositionById(id)
    }

    async updatePositionById(id: string, name: string) {
        return await this.adminPositionRepository.updatePositionById(id, name)
    }
}