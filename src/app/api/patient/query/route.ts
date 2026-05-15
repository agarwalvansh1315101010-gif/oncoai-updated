import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { jwtVerify } from 'jose'
import { encrypt } from '@/lib/crypto'

async function getPatientFromToken(req: Request) {
  const token = req.headers.get('cookie')?.split('token=')[1]?.split(';')[0]
  if (!token) return null
  try {
    const secret = new TextEncoder().encode(process.env.JWT_SECRET || 'super-secret-jwt-key-replace-in-production')
    const { payload } = await jwtVerify(token, secret)
    return await prisma.user.findUnique({ where: { id: payload.id as string }, include: { patientProfile: true } })
  } catch { return null }
}

export async function POST(req: Request) {
  const user = await getPatientFromToken(req)
  if (!user || !user.patientProfile) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { subject, message } = await req.json()
  if (!message) return NextResponse.json({ error: 'Message is required' }, { status: 400 })

  const query = await prisma.query.create({
    data: {
      patientId: user.patientProfile.id,
      subject: subject || 'General Question',
      encryptedMessage: encrypt(message),
      status: 'PENDING',
    }
  })

  await prisma.auditLog.create({
    data: { userId: user.id, action: 'QUERY_SUBMITTED', resourceType: 'QUERY', resourceId: query.id }
  })

  return NextResponse.json({ success: true, id: query.id })
}
