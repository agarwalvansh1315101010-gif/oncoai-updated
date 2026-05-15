import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { jwtVerify } from 'jose'

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
  if (!user.patientProfile.assignedDoctorId) return NextResponse.json({ error: 'No doctor assigned' }, { status: 400 })

  const { scheduledAt, type, notes } = await req.json()
  if (!scheduledAt) return NextResponse.json({ error: 'Date required' }, { status: 400 })

  const appt = await prisma.appointment.create({
    data: {
      patientId: user.patientProfile.id,
      doctorId: user.patientProfile.assignedDoctorId,
      scheduledAt: new Date(scheduledAt),
      type: type || 'VIDEO',
      notes: notes || null,
    }
  })

  await prisma.auditLog.create({
    data: { userId: user.id, action: 'APPOINTMENT_BOOKED', resourceType: 'APPOINTMENT', resourceId: appt.id }
  })

  return NextResponse.json({ success: true, appointment: appt })
}
