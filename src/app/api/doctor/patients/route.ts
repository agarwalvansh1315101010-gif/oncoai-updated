import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { jwtVerify } from 'jose'
import { decrypt } from '@/lib/crypto'

async function getDoctorFromToken(req: Request) {
  const token = req.headers.get('cookie')?.split('token=')[1]?.split(';')[0]
  if (!token) return null
  try {
    const secret = new TextEncoder().encode(process.env.JWT_SECRET || 'super-secret-jwt-key-replace-in-production')
    const { payload } = await jwtVerify(token, secret)
    return await prisma.user.findUnique({ where: { id: payload.id as string }, include: { doctorProfile: true } })
  } catch { return null }
}

export async function GET(req: Request) {
  const user = await getDoctorFromToken(req)
  if (!user || !user.doctorProfile) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const patients = await prisma.patientProfile.findMany({
    where: { assignedDoctorId: user.doctorProfile.id },
    include: {
      documents: { orderBy: { uploadedAt: 'desc' } },
      aiReports: { orderBy: { createdAt: 'desc' } },
      queries: {
        orderBy: { createdAt: 'desc' },
        include: {
          responses: { include: { doctor: true }, orderBy: { createdAt: 'asc' } }
        }
      },
      appointments: {
        orderBy: { scheduledAt: 'asc' },
        include: { doctor: true }
      }
    }
  })

  const safePats = patients.map(p => ({
    ...p,
    queries: p.queries.map(q => ({
      ...q,
      encryptedMessage: (() => { try { return decrypt(q.encryptedMessage) } catch { return q.encryptedMessage } })(),
      responses: q.responses.map(r => ({
        ...r,
        encryptedMessage: (() => { try { return decrypt(r.encryptedMessage) } catch { return r.encryptedMessage } })()
      }))
    }))
  }))

  return NextResponse.json({ doctor: user.doctorProfile, patients: safePats })
}
