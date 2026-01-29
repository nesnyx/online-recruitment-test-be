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


export const magicLoginToken = (username: string, password: string) => {
    const token = jwt.sign(
        { username, password },
        ENV.JWT_SECRET_KEY_MAGIC_LOGIN!,
        { expiresIn: '3d' }
    )
    return token
}

export const verifyMagicLoginToken = (token: string) => {
    return jwt.verify(token, ENV.JWT_SECRET_KEY_MAGIC_LOGIN!) as {  username: string, password: string};
};

export const verifyAccessToken = (token: string) => {
    return jwt.verify(token, ENV.JWT_ACCESS_SECRET!) as { id: string, username: string, role: string, position: string };
};