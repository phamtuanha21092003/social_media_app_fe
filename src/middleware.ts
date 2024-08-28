import { NextURL } from "next/dist/server/web/next-url"
import { NextRequest } from "next/server"
import { NextResponse } from "next/server"

const pathnamesAuth: string[] = ["/", "/sign_up"]

export async function middleware(req: NextRequest) {
    if (!pathnamesAuth?.includes(req.nextUrl.pathname)) {
        const cookieAccessToken = req.cookies.get("accessToken")

        const cookieRefreshToken = req.cookies.get("refreshToken")

        if (!(cookieAccessToken || cookieRefreshToken)) {
            return NextResponse.redirect(getUrlLogin(req))
        }
    }
}

export const config = {
    matcher: ["/feed", "/edit-profile"],
}

function getUrlLogin(req: NextRequest): NextURL {
    const url = req.nextUrl.clone()

    url.pathname = "/"

    return url
}
