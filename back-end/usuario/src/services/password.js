import { scrypt, randomBytes } from 'crypto';
import { promisify } from 'util';
import crypto from 'crypto'
import CryptoJS from 'crypto-js'

import dotenv from 'dotenv'
dotenv.config()

const scryptAsync = promisify(scrypt);

const { SECRET_KEY, SECRET_IV, ENCRYPTION_METHOD } = process.env

export class Password {
    static async toHash(password) {
        const salt = randomBytes(8).toString('hex');
        const buf = Buffer(await scryptAsync(password, salt, 64))

        return `${buf.toString('hex')}.${salt}`;
    }

    static async compare(storedPassword, suppliedPassword) {
        const [hashedPassword, salt] = storedPassword.split('.');
        const buf = Buffer.from(await scryptAsync(suppliedPassword, salt, 64))

        return buf.toString('hex') === hashedPassword;
    }
}