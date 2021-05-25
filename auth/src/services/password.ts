// import { scrypt, randomBytes } from 'crypto'
// import { promisify } from 'util'

import bcrypt from 'bcrypt'

// const scryptAsync = promisify(scrypt)

export class Password {
  static async toHash(password: string) {
    // const salt = randomBytes(8).toString('hex')
    // const buffer = (await scryptAsync(password, salt, 64)) as Buffer

    // return `${buffer.toString('hex')}.${salt}`
    return bcrypt.hash(password, 8)
  }

  static async compare(storedPassword: string, suppliedPassword: string) {
    // const [hashedPassword, salt] = storedPassword.split('.')
    // const buffer = (await scryptAsync(suppliedPassword, salt, 64)) as Buffer

    // return buffer.toString('hex') == hashedPassword

    return bcrypt.compare(suppliedPassword, storedPassword)
  }
}
