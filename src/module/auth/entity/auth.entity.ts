

interface IAuthRepository {
    login(payload: Record<string, any>): Promise<any>
    register(payload: Record<string, any>): Promise<any>
}