import { Position } from "../../../config/database/models/Position"
import { AppError } from "../../../utils/app-error"

export interface IPosition{

    findPositions(): Promise<Position[]>
    findPositionById(id: string): Promise<Position>
    createPosition(name: string): Promise<Position>
    deletePositionById(id: string): Promise<boolean>
    updatePositionById(id: string, name: string): Promise<Position>
}


export class AdminPositionRepository implements IPosition {
    constructor(private  position : typeof Position){}
    async findPositions(): Promise<Position[]> {
        return await this.position.findAll()
    }

    async findPositionById(id: string): Promise<Position> {
        const position = await this.position.findByPk(id)
        if (!position) {
            throw new AppError('Position not found', 404)
        }
        return position
    }

    async createPosition(name: string): Promise<Position> {
        return await this.position.create({ name })
    }

    async deletePositionById(id: string): Promise<boolean> {
        const position = await this.position.findByPk(id)
        if (!position) {
            throw new AppError('Position not found', 404)
        }
        await position.destroy()
        return true
    }

    async updatePositionById(id: string, name: string): Promise<Position> {
        const position = await this.position.findByPk(id)
        if (!position) {
            throw new AppError('Position not found', 404)
        }
        return await position.update({ name })
    }
}