import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { jwtVerify } from 'jose'
import { encrypt } from '@/lib/crypto'

async function getDoctorFromToken(req: Request) {
  const token = req.headers.get('cookie')?.split('token=')[1]?.split(';')[0]
  if (!token) return null
  try {
    const secret = new TextEncoder().encode(process.env.JWT_SECRET || 'super-secret-jwt-key-replace-in-production')
    const { payload } = await jwtVerify(token, secret)
    return await prisma.user.findUnique({ where: { id: payload.id as string }, include: { doctorProfile: true } })
  } catch { return null }
}

export async function POST(req: Request) {
  const user = await getDoctorFromToken(req)
  if (!user || !user.doctorProfile) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { queryId, message } = await req.json()
  if (!queryId || !message) return NextResponse.json({ error: 'Missing fields' }, { status: 400 })

  const response = await prisma.response.create({
    data: {
      queryId,
      doctorId: user.doctorProfile.id,
      encryptedMessage: encrypt(message),
    }
  })

  await prisma.query.update({ where: { id: queryId }, data: { status: 'ANSWERED' } })

  await prisma.auditLog.create({
    data: { userId: user.id, action: 'DOCTOR_RESPONDED', resourceType: 'RESPONSE', resourceId: response.id }
  })

  return NextResponse.json({ success: true, id: response.id })
}
