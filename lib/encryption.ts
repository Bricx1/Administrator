import crypto from 'crypto'

const IV_LENGTH = 16
const KEY = process.env.ENCRYPTION_KEY?.padEnd(32, '0').slice(0, 32) || 'default_encryption_key_32bytes!'

export function encrypt(text: string): string {
  const iv = crypto.randomBytes(IV_LENGTH)
  const cipher = crypto.createCipheriv('aes-256-cbc', Buffer.from(KEY), iv)
  let encrypted = cipher.update(text, 'utf8', 'base64')
  encrypted += cipher.final('base64')
  return iv.toString('base64') + ':' + encrypted
}
