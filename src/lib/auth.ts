import jwt from 'jsonwebtoken'

const JWT_SECRET = process.env.JWT_SECRET || 'super-secret-jwt-key-replace-in-production'

export function signJwt(payload: any, expiresIn: string = '1d'): string {
  return jwt.sign(payload, JWT_SECRET, { expiresIn })
}

export function verifyJwt(token: string): any {
  try {
    return jwt.verify(token, JWT_SECRET)
  } catch (error) {
    return null
  }
}
