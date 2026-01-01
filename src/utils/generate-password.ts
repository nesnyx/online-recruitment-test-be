export function generateSecureRandomPassword(length = 12) {
    const charset = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*()_+-=[]{}|;:,.<>?';
    const charsetLength = charset.length;
    const passwordArray = new Uint32Array(length);
    crypto.getRandomValues(passwordArray);

    return Array.from(passwordArray, (value) => charset[value % charsetLength]).join('');
}