import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(request: NextRequest) {
  // Get the origin from the request headers
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const origin = request.headers.get('origin') || ''

  // Define response
  const response = NextResponse.next()

  // Add CORS headers
  response.headers.set('Access-Control-Allow-Origin', '*') // Or specify your domains
  response.headers.set('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS')
  response.headers.set('Access-Control-Allow-Headers', 'Content-Type, Authorization')
  response.headers.set('Access-Control-Max-Age', '86400')

  return response
}

// Configure which paths should be processed by this middleware
export const config = {
  matcher: '/api/:path*'
}
