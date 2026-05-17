import { jwtVerify } from 'jose'
import { NextRequest, NextResponse } from 'next/server'

const JWT_SECRET = process.env.JWT_SECRET || 'super-secret-jwt-key-replace-in-production'

export async function middleware(req: NextRequest) {
  const token = req.cookies.get('token')?.value

  const isAuthRoute = req.nextUrl.pathname.startsWith('/login') || req.nextUrl.pathname.startsWith('/register')
  
  if (isAuthRoute) {
    if (token) {
        // We could redirect to role-specific dashboard here, but we need to decode first
        try {
            const secret = new TextEncoder().encode(JWT_SECRET)
            const { payload } = await jwtVerify(token, secret)
            const role = (payload.role as string).toLowerCase()
            return NextResponse.redirect(new URL(`/${role}/dashboard`, req.url))
        } catch {
            // invalid token, continue to login
        }
    }
    return NextResponse.next()
  }

  // Protected routes
  const isProtectedRoute = req.nextUrl.pathname.startsWith('/patient') || 
                           req.nextUrl.pathname.startsWith('/doctor') || 
                           req.nextUrl.pathname.startsWith('/admin')

  if (isProtectedRoute) {
    if (!token) return NextResponse.redirect(new URL('/login', req.url))

    try {
      const secret = new TextEncoder().encode(JWT_SECRET)
      const { payload } = await jwtVerify(token, secret)
      
      const role = payload.role as string
      
      if (req.nextUrl.pathname.startsWith('/patient') && role !== 'PATIENT') {
        return NextResponse.redirect(new URL('/login', req.url))
      }
      if (req.nextUrl.pathname.startsWith('/doctor') && role !== 'DOCTOR') {
        return NextResponse.redirect(new URL('/login', req.url))
      }
      if (req.nextUrl.pathname.startsWith('/admin') && role !== 'ADMIN') {
        return NextResponse.redirect(new URL('/login', req.url))
      }

      return NextResponse.next()
    } catch {
      return NextResponse.redirect(new URL('/login', req.url))
    }
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/patient/:path*', '/doctor/:path*', '/admin/:path*', '/login', '/register'],
}
