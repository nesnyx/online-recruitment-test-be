import jwt from 'jsonwebtoken';
import { ENV } from '../env';

export const generateTokens = (id: string, username: string, role: string) => {
    const accessToken = jwt.sign({ id, username, role }, ENV.JWT_ACCESS_SECRET!, { expiresIn: '1d' });
    // const refreshToken = jwt.sign({ id, username, role }, ENV.JWT_REFRESH_SECRET!, { expiresIn: '7d' });
    return accessToken;
};

export const verifyAccessToken = (token: string) => {
    return jwt.verify(token, ENV.JWT_ACCESS_SECRET!) as { id: string, username: string, role: string };
};