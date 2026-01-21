import { generateSecurePassword, generateRandomUsername } from "../../../utils/generate-password";
import { CreateAccountType } from "../dto/create-account.dto";
import { UpdateAccountType } from "../dto/update-account.dto";
import { IUser } from "../repository/admin.user.repository";


export class AdminUserService {
    constructor(private adminUserRepository: IUser) { }

    async createUserAccount(name: string, email: string, positionId?: string) {
        const password = generateSecurePassword()
        const username = generateRandomUsername()
        const payload: CreateAccountType = {
            name,
            email,
            positionId,
            username,
            password
        }
        return await this.adminUserRepository.createUserAccount(payload)
    }

    async findUserAccountByID(id: string) {
        return await this.adminUserRepository.findUserAccountByID(id)
    }

    async getAllUserAccount() {
        const accounts = await this.adminUserRepository.findAllUserAccount()
        return accounts.map((account: any) => ({
            id: account.id,
            username: account.username,
            password: account.password,
            name: account.name,
            email: account.email,
            position: account.positions?.name || 'No Position',
            createdAt : account.createAt
        }))
    }

    async updateAccount(accountId: string, payload: UpdateAccountType) {
        return await this.adminUserRepository.updateAccounts(accountId, payload)
    }

  

    async deleteAccountById(id: string) {
        return await this.adminUserRepository.deleteAccountById(id)
    }


    async findUserbyIds(userIds : string[]){
        return await this.adminUserRepository.findUsersByIds(userIds)
    }
}