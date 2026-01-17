import { Op } from "sequelize"
import { Position } from "../../../config/database/models/Position"
import { User } from "../../../config/database/models/User"
import { AppError } from "../../../utils/app-error"
import { CreateAccountType } from "../dto/create-account.dto"
import { UpdateAccountType } from "../dto/update-account.dto"

export interface IUser {
    findUserAccountByID(id: string): Promise<User>
    createUserAccount(payload: CreateAccountType): Promise<User>
    findAllUserAccount(): Promise<User[]>
    updateAccounts(id: string, payload: UpdateAccountType): Promise<User>
    findUsersByIds(ids: string[]): Promise<User[]>
    deleteAccountById(id: string): Promise<boolean>
}


export class AdminUserRepository implements IUser {
    constructor(private user: typeof User,private position : typeof Position) { }
    async findUserAccountByID(id: string): Promise<User> {
        const userAccount = await this.user.findByPk(id)
        if (!userAccount) {
            throw new AppError('User account not found', 404)
        }
        return userAccount
    }
    async createUserAccount(payload: CreateAccountType): Promise<User> {
            return await this.user.create(payload)
        }
    async findAllUserAccount(): Promise<User[]> {
            return await this.user.findAll({
                attributes: ['id', 'username', 'password', 'name', 'email'],
                include: [
                    {
                        model: this.position,
                        as: 'positions',
                        attributes: ['name']
                    }
                ]
            })
        }
    async updateAccounts(id: string, payload: UpdateAccountType): Promise<User> {
        const user = await this.user.findByPk(id)
        if (!user) {
            throw new AppError('User not found', 404)
        }
        return await user.update({
            name: payload.name,
            email: payload.email,
            positionId: payload.position
        })
    }
    async findUsersByIds(userIds: string[]): Promise<User[]> {
        return await this.user.findAll({
            where: {
                id: {
                    [Op.in]: userIds
                }
            },
            attributes: ['id', 'username', 'name', 'password', 'email']
        });
    }
     async deleteAccountById(id: string): Promise<boolean> {
        const account = await this.user.findByPk(id)
        if (!account) {
            throw new AppError('Account not found', 404)
        }
        await account.destroy()
        return true
    }

}

