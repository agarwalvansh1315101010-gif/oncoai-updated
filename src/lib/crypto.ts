import crypto from 'crypto'

const ENCRYPTION_KEY = process.env.ENCRYPTION_KEY || '12345678901234567890123456789012' // Must be 32 bytes
const ALGORITHM = 'aes-256-cbc'

export function encrypt(text: string): string {
  const iv = crypto.randomBytes(16)
  const cipher = crypto.createCipheriv(ALGORITHM, Buffer.from(ENCRYPTION_KEY), iv)
  let encrypted = cipher.update(text)
  encrypted = Buffer.concat([encrypted, cipher.final()])
  return iv.toString('hex') + ':' + encrypted.toString('hex')
}

export function decrypt(text: string): string {
  const textParts = text.split(':')
  const ivStr = textParts.shift()
  if (!ivStr) throw new Error("Invalid encrypted text")
  const iv = Buffer.from(ivStr, 'hex')
  const encryptedText = Buffer.from(textParts.join(':'), 'hex')
  const decipher = crypto.createDecipheriv(ALGORITHM, Buffer.from(ENCRYPTION_KEY), iv)
  let decrypted = decipher.update(encryptedText)
  decrypted = Buffer.concat([decrypted, decipher.final()])
  return decrypted.toString()
}
