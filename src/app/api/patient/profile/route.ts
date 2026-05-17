import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { jwtVerify } from 'jose'
import { decrypt } from '@/lib/crypto'

async function getPatientFromToken(req: Request) {
  const token = req.headers.get('cookie')?.split('token=')[1]?.split(';')[0]
  if (!token) return null
  try {
    const secret = new TextEncoder().encode(process.env.JWT_SECRET || 'super-secret-jwt-key-replace-in-production')
    const { payload } = await jwtVerify(token, secret)
    const user = await prisma.user.findUnique({
      where: { id: payload.id as string },
      include: { patientProfile: true }
    })
    return user
  } catch { return null }
}

// GET full patient data for dashboard
export async function GET(req: Request) {
  const user = await getPatientFromToken(req)
  if (!user || !user.patientProfile) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const profile = await prisma.patientProfile.findUnique({
    where: { id: user.patientProfile.id },
    include: {
      consentRecord: true,
      documents: { orderBy: { uploadedAt: 'desc' } },
      aiReports: { orderBy: { createdAt: 'desc' } },
      appointments: {
        orderBy: { scheduledAt: 'asc' },
        include: { doctor: true }
      },
      queries: {
        orderBy: { createdAt: 'desc' },
        include: {
          responses: {
            include: { doctor: true },
            orderBy: { createdAt: 'asc' }
          }
        }
      },
      assignedDoctor: true
    }
  })

  if (!profile) return NextResponse.json({ error: 'Not found' }, { status: 404 })

  // Decrypt messages
  const safeProfile = {
    ...profile,
    queries: profile.queries.map(q => ({
      ...q,
      encryptedMessage: (() => { try { return decrypt(q.encryptedMessage) } catch { return q.encryptedMessage } })(),
      responses: q.responses.map(r => ({
        ...r,
        encryptedMessage: (() => { try { return decrypt(r.encryptedMessage) } catch { return r.encryptedMessage } })()
      }))
    }))
  }

  return NextResponse.json(safeProfile)
}
