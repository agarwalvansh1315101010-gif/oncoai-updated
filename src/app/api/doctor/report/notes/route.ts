import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { jwtVerify } from 'jose'

async function getDoctorFromToken(req: Request) {
  const cookie = req.headers.get('cookie')
  const token = cookie?.split('token=')[1]?.split(';')[0]
  if (!token) return null
  try {
    const secret = new TextEncoder().encode(process.env.JWT_SECRET || 'super-secret-jwt-key-replace-in-production')
    const { payload } = await jwtVerify(token, secret)
    return await prisma.user.findUnique({ where: { id: payload.id as string }, include: { doctorProfile: true } })
  } catch { return null }
}

export async function POST(req: Request) {
  const user = await getDoctorFromToken(req)
  if (!user || !user.doctorProfile) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const { reportId, doctorNotes } = await req.json()
    if (!reportId) {
      return NextResponse.json({ error: 'Missing reportId' }, { status: 400 })
    }

    // Update the report notes and transition status to READY
    const updatedReport = await prisma.aiReport.update({
      where: { id: reportId },
      data: {
        doctorNotes,
        status: 'READY'
      }
    })

    // Also update audit log for transparency and security
    await prisma.auditLog.create({
      data: {
        userId: user.id,
        action: 'DOCTOR_REVIEW_SUBMITTED',
        resourceType: 'AiReport',
        resourceId: reportId,
        details: `Doctor ${user.doctorProfile.lastName} submitted clinical notes for AI Report.`
      }
    })

    return NextResponse.json({ success: true, report: updatedReport })
  } catch (err) {
    console.error('Error saving doctor notes:', err)
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
  }
}
