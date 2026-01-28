import { getRandomValues, randomBytes } from "crypto";

export function generateRandomUsername(prefix = 'user') {
    const suffix = randomBytes(6).toString('hex');
    return `${prefix}_${suffix}`;
}

export function generateSecurePassword(length = 12) {
    const charset = 'abcdefghijkmnopqrstuvwxyzABCDEFGHJKLMNPQRSTUVWXYZ23456789!@#$%^&*';
    let password = '';
    const values = new Uint32Array(length);
    getRandomValues(values);
    for (let i = 0; i < length; i++) {
        password += charset[values[i] % charset.length];
    }
    return password;
}