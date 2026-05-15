import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { jwtVerify } from 'jose'

async function verifyAdmin(req: Request) {
  const token = req.headers.get('cookie')?.split('token=')[1]?.split(';')[0]
  if (!token) return null
  try {
    const secret = new TextEncoder().encode(process.env.JWT_SECRET || 'super-secret-jwt-key-replace-in-production')
    const { payload } = await jwtVerify(token, secret)
    if (payload.role !== 'ADMIN') return null
    return payload
  } catch { return null }
}

export async function POST(req: Request) {
  const admin = await verifyAdmin(req)
  if (!admin) return NextResponse.json({ error: 'Forbidden' }, { status: 403 })

  const { patientProfileId, doctorProfileId } = await req.json()
  if (!patientProfileId || !doctorProfileId) return NextResponse.json({ error: 'Missing fields' }, { status: 400 })

  await prisma.patientProfile.update({
    where: { id: patientProfileId },
    data: { assignedDoctorId: doctorProfileId }
  })

  await prisma.auditLog.create({
    data: { userId: admin.id as string, action: 'CASE_ASSIGNED', resourceType: 'PATIENT', resourceId: patientProfileId, details: `Assigned to doctor ${doctorProfileId}` }
  })

  return NextResponse.json({ success: true })
}
