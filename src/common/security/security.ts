import bcrypt from 'bcrypt';
import { env } from '../../configuration/env.service.js';

export const generateHash = async ({
    password,
    salt = env.salt
}: {
    password: string;
    salt?: number;
}) => {
  
    const hashedPassword = await bcrypt.hash(password, Number(salt));
    return hashedPassword;
};

export const compareHash = ({
    password,
    hashedPassword,
}: {
    password: string;
    hashedPassword: string;
}) => {
    return bcrypt.compare(password, hashedPassword);
};