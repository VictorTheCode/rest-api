import { NextResponse } from "next/server";
import { authMiddleware } from "./middlewares/api/auth.middleware";

export const config = {
  matcher: "/api/:path*",
};

export default function middleware(req: Request) {
  const authResult = authMiddleware(req);
  if (!authResult?.isValid && req.url.includes("/api/blogs")) {
    return new NextResponse(JSON.stringify({ message: "Unauthorized" }), {
      status: 401,
    });
  }
  return NextResponse.next();
}
