import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(request: NextRequest) {
  const url = request.nextUrl.clone()
  
  if (url.hostname === 'dstack-sim-explorer.vercel.app') {
    url.hostname = 'ra-quote-explorer.vercel.app'
    return NextResponse.redirect(url)
  }
  
  return NextResponse.next()
}

// 配置中间件匹配的路由
export const config = {
  matcher: [
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
  ],
}
