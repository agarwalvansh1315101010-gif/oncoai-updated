import jwt from 'jsonwebtoken'

const JWT_SECRET = process.env.JWT_SECRET || 'super-secret-jwt-key-replace-in-production'

export function signJwt(payload: object, expiresIn: string | number = '1d'): string {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: expiresIn as jwt.SignOptions['expiresIn'] })
}

export function verifyJwt(token: string): string | jwt.JwtPayload | null {
  try {
    return jwt.verify(token, JWT_SECRET)
  } catch {
    return null
  }
}
