import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { signJwt } from '@/lib/auth'

export async function POST(req: Request) {
  try {
    const { email, otp } = await req.json()

    if (!email || !otp) {
      return NextResponse.json({ error: 'Missing email or OTP code' }, { status: 400 })
    }

    const user = await prisma.user.findUnique({
      where: { email },
      include: { patientProfile: true, doctorProfile: true }
    })

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 })
    }

    if (!user.verificationCode || user.verificationCode !== otp) {
      return NextResponse.json({ error: 'Invalid verification OTP code' }, { status: 400 })
    }

    if (user.verificationExpires && user.verificationExpires < new Date()) {
      return NextResponse.json({ error: 'Verification OTP code has expired' }, { status: 400 })
    }

    // Update user to verified
    await prisma.user.update({
      where: { id: user.id },
      data: {
        isVerified: true,
        verificationCode: null,
        verificationExpires: null
      }
    })

    // Write audit log
    await prisma.auditLog.create({
      data: {
        userId: user.id,
        action: 'USER_VERIFIED',
        resourceType: 'USER',
        resourceId: user.id,
        ipAddress: req.headers.get('x-forwarded-for') || 'unknown',
      }
    })

    // Issue JWT cookie so user is logged in automatically!
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
    console.error('OTP verification error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
