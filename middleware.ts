import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(request: NextRequest) {
  if (request.nextUrl.pathname.startsWith('/api/integrations')) {
    const token = request.headers.get('authorization') || request.cookies.get('token')?.value
    if (!token) {
      console.log('[middleware] missing auth')
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 })
    }
  }
  return NextResponse.next()
}

export const config = {
  matcher: ['/api/integrations/:path*']
}
