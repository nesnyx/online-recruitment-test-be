import { generateTokens } from "../../../config/jwt";
import { AppError } from "../../../utils/app-error";
import { AdminPositionService } from "../../admin/services/admin.position.service";

import { AuthDto } from "../dto/auth.dto";
import { IAuthRepository } from "../repository/auth.repository";

export enum Role {
    ADMIN = 'ADMIN',
    USER = 'USER'
}

export class AuthService {
    constructor(private authRepository: IAuthRepository, private readonly positionService : AdminPositionService) { }

    async loginAdmin(payload: AuthDto) {
        const account = await this.authRepository.loginAdmin(payload)
        if (!account) {
            throw new AppError('Account not found', 404)
        }
        const generateToken = generateTokens(account.id, account.username, Role.ADMIN)
        return generateToken

    }

    async loginUser(payload: AuthDto) {
        const account = await this.authRepository.loginUser(payload)
        if (!account) {
            throw new AppError('Account not found', 404)
        }
        const position = await this.positionService.getPositionById(account.positionId)
        const generateToken = generateTokens(account.id, account.name, Role.USER, position.name)
        return generateToken
    }
    async registerAdmin(payload: AuthDto) {
        const account = await this.authRepository.registerAdmin(payload)
        if (!account) {
            throw new AppError('Account not found', 404)
        }
        return account
    }
}

