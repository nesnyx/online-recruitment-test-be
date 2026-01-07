import jwt from 'jsonwebtoken';
import { ENV } from '../env';

export const generateTokens = (
    id: string,
    username: string,
    role: string,
    position?: string | null
) => {
    const payload = {
        id,
        username,
        role,
        ...(position && { position })
    };
    const accessToken = jwt.sign(
        payload,
        ENV.JWT_ACCESS_SECRET!,
        { expiresIn: '1d' }
    );
    return accessToken;
};

export const verifyAccessToken = (token: string) => {
    return jwt.verify(token, ENV.JWT_ACCESS_SECRET!) as { id: string, username: string, role: string };
};