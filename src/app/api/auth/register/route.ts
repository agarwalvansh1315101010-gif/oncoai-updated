import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import bcrypt from 'bcrypt'


export async function POST(req: Request) {
  try {
    const body = await req.json()
    const { email, password, role, firstName, lastName } = body

    if (!email || !password || !role || !firstName || !lastName) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
    }

    const existingUser = await prisma.user.findUnique({ where: { email } })
    if (existingUser) {
      return NextResponse.json({ error: 'User already exists' }, { status: 400 })
    }

    const passwordHash = await bcrypt.hash(password, 10)

    // Generate secure 6-digit OTP code
    const otpCode = Math.floor(100000 + Math.random() * 900000).toString()
    const otpExpiry = new Date(Date.now() + 15 * 60 * 1000) // 15 minutes

    const user = await prisma.user.create({
      data: {
        email,
        passwordHash,
        role,
        isVerified: false,
        verificationCode: otpCode,
        verificationExpires: otpExpiry
      }
    })

    if (role === 'PATIENT') {
      await prisma.patientProfile.create({
        data: {
          userId: user.id,
          firstName,
          lastName,
          dateOfBirth: new Date(), // Placeholder, should be in form
        }
      })
    } else if (role === 'DOCTOR') {
      await prisma.doctorProfile.create({
        data: {
          userId: user.id,
          firstName,
          lastName,
          specialization: 'Oncology',
          licenseNumber: 'PENDING',
        }
      })
    }

    await prisma.auditLog.create({
      data: {
        userId: user.id,
        action: 'USER_REGISTERED',
        resourceType: 'USER',
        resourceId: user.id,
        ipAddress: req.headers.get('x-forwarded-for') || 'unknown',
      }
    })

    // Console-log the code so it is easily retrieved in local development output
    console.log(`
┌────────────────────────────────────────────────────────┐
│  ONCOAI PORTAL — OTP REGISTRATION DISPATCH             │
│                                                        │
│  Recipient: ${email}                               │
│  Verification Code: ${otpCode}                            │
│  Expires: 15 minutes                                   │
└────────────────────────────────────────────────────────┘
    `)

    return NextResponse.json({ 
      success: true, 
      verificationRequired: true, 
      email: user.email 
    })
  } catch (error) {
    console.error('Registration error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
