import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { jwtVerify } from 'jose'

export async function POST(req: Request) {
  try {
    const token = req.headers.get('cookie')?.split('token=')[1]?.split(';')[0]
    if (!token) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    const secret = new TextEncoder().encode(process.env.JWT_SECRET || 'super-secret-jwt-key-replace-in-production')
    const { payload } = await jwtVerify(token, secret)

    const user = await prisma.user.findUnique({
      where: { id: payload.id as string },
      include: { patientProfile: true }
    })

    if (!user || !user.patientProfile) {
      return NextResponse.json({ error: 'Patient not found' }, { status: 404 })
    }

    const consent = await prisma.consentRecord.create({
      data: {
        patientId: user.patientProfile.id,
        agreedToTerms: true,
        agreedToDataUse: true,
        ipAddress: req.headers.get('x-forwarded-for') || 'unknown',
      }
    })

    await prisma.auditLog.create({
      data: {
        userId: user.id,
        action: 'CONSENT_ACCEPTED',
        resourceType: 'CONSENT',
        resourceId: consent.id,
        ipAddress: req.headers.get('x-forwarded-for') || 'unknown',
      }
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Consent error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
