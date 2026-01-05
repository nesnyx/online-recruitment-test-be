import { getRandomValues, randomBytes } from "crypto";

export function generateRandomUsername(prefix = 'user') {
    const suffix = randomBytes(6).toString('hex');
    return `${prefix}_${suffix}`;
}

export function generateSecurePassword(length = 12) {
    // Menghilangkan karakter ambigu (l, I, 1, 0, O) agar mudah diketik ulang
    const charset = 'abcdefghijkmnopqrstuvwxyzABCDEFGHJKLMNPQRSTUVWXYZ23456789!@#$%^&*';
    let password = '';

    // Menggunakan crypto.getRandomValues untuk keamanan tingkat kriptografi
    const values = new Uint32Array(length);
    getRandomValues(values);

    for (let i = 0; i < length; i++) {
        password += charset[values[i] % charset.length];
    }

    return password;
}