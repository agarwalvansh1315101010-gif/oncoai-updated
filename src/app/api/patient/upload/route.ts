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

  const { fileName, fileType, fileSize } = await req.json()
  if (!fileName) return NextResponse.json({ error: 'File name required' }, { status: 400 })

  const doc = await prisma.uploadedDocument.create({
    data: {
      patientId: user.patientProfile.id,
      fileName,
      fileUrl: `/uploads/${Date.now()}_${fileName}`,
      fileType: fileType || 'application/octet-stream',
      fileSize: fileSize || 0,
    }
  })

  await prisma.auditLog.create({
    data: { userId: user.id, action: 'DOCUMENT_UPLOADED', resourceType: 'DOCUMENT', resourceId: doc.id }
  })

  return NextResponse.json({ success: true, document: doc })
}
