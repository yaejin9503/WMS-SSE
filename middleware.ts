import { createMiddlewareClient } from "@supabase/auth-helpers-nextjs";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export async function middleware(req: NextRequest) {
  const res = NextResponse.next();
  const supabase = createMiddlewareClient({ req, res });

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    // 로그인 페이지로 리다이렉트
    const loginUrl = new URL("/login", req.url);
    return NextResponse.redirect(loginUrl);
  }

  return res;
}

// 적용 경로 지정
export const config = {
  matcher: [
    /*
     * 보호할 경로 지정 (예: /dashboard, /admin, /protected 등)
     */
    "/list/:path*",
    "/inbound/:path*",
    "/outbound/:path*",
    "/track/:path*",
    // 필요에 따라 추가
  ],
};
