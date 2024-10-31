import { NextResponse } from "next/server";
import { authMiddleware } from "./middlewares/api/auth.middleware";
import { logMiddleware } from "./middlewares/api/log.middleware";

export const config = {
  matcher: "/api/:path*",
};

export default function middleware(req: Request) {
  if (req.url.includes("/api/blogs")) {
    const logResult = logMiddleware(req);
    console.log(logResult.res);
  }

  const authResult = authMiddleware(req);
  if (!authResult?.isValid) {
    return new NextResponse(JSON.stringify({ message: "Unauthorized" }), {
      status: 401,
    });
  }
  return NextResponse.next();
}
