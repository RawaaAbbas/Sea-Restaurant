// import { NextResponse } from "next/server";

// export function middleware() {
//   return NextResponse.next();
// }

// export const config = {
//   matcher: ["/admin/:path*"],
// };
// export { auth as middleware } from "@/auth";

// export const config = {
//   matcher: ["/admin/:path*"],
// };

import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  // هنا نكدر نشيك الكوكيز الخاصة بالـ Auth بشكل خفيف بدون ما نسحب كود قاعدة البيانات الثقيل
  const sessionToken =
    request.cookies.get("authjs.session-token") ||
    request.cookies.get("__Secure-authjs.session-token");

  // إذا رايحة لصفحة الـ admin وماكو توكن، نرجعها لصفحة تسجيل الدخول
  if (request.nextUrl.pathname.startsWith("/admin") && !sessionToken) {
    return NextResponse.redirect(new URL("/login", request.url)); // غيري /login لمسار تسجيل الدخول مالتچ إذا كان مختلف
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * تشغيل الـ middleware فقط على مسارات الـ admin وحماية الـ auth
     * واستثناء ملفات الصور والـ static حتى ينزل الحجم لأقل من 10KB!
     */
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};
