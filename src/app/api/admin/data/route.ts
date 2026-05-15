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

export async function GET(req: Request) {
  const admin = await verifyAdmin(req)
  if (!admin) return NextResponse.json({ error: 'Forbidden' }, { status: 403 })

  const users = await prisma.user.findMany({
    select: { id: true, email: true, role: true, createdAt: true },
    orderBy: { createdAt: 'desc' }
  })

  const patients = await prisma.patientProfile.findMany({
    include: { user: { select: { email: true } }, assignedDoctor: { select: { firstName: true, lastName: true } } }
  })

  const doctors = await prisma.doctorProfile.findMany({
    include: { user: { select: { email: true } }, patients: { select: { id: true, firstName: true, lastName: true } } }
  })

  const auditLogs = await prisma.auditLog.findMany({
    orderBy: { createdAt: 'desc' },
    take: 100,
    include: { user: { select: { email: true, role: true } } }
  })

  return NextResponse.json({ users, patients, doctors, auditLogs })
}
