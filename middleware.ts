// import { NextResponse } from "next/server";

// export function middleware() {
//   return NextResponse.next();
// }

// export const config = {
//   matcher: ["/admin/:path*"],
// };
export { auth as middleware } from "@/auth";

export const config = {
  matcher: ["/admin/:path*"],
};
