import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import bcrypt from 'bcrypt'
import { signJwt } from '@/lib/auth'

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

    const user = await prisma.user.create({
      data: {
        email,
        passwordHash,
        role,
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

    const token = signJwt({ id: user.id, role: user.role, email: user.email })

    const response = NextResponse.json({ success: true, role: user.role })
    response.cookies.set({
      name: 'token',
      value: token,
      httpOnly: true,
      path: '/',
      secure: process.env.NODE_ENV === 'production',
      maxAge: 60 * 60 * 24 // 1 day
    })

    return response
  } catch (error) {
    console.error('Registration error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
