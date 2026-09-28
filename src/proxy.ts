import { type NextRequest, NextResponse } from "next/server";
import { getUserBySessionToken, SESSION_COOKIE_NAME } from "@/lib/auth";

/**
 * Games anyone may play without an account — the folder names under
 * public/games of the slugs `isUnlocked` treats as free
 * (src/app/components/hero-data.ts). Keep the two lists in step.
 */
const FREE_GAME_FOLDERS = new Set(["catch the brand", "target shooter"]);

/*
 * The games are static files in public/games, so hiding the Play button
 * isn't enough: without this, a signed-out visitor can still open any game
 * from a copied link, their history, or a tab left open from before they
 * logged out. Every file of a locked game now needs a live session.
 */
export async function proxy(request: NextRequest) {
  const segments = request.nextUrl.pathname.split("/");
  // ["", "games", "<folder>", ...]
  const folder = decodeURIComponent(segments[2] ?? "");

  if (FREE_GAME_FOLDERS.has(folder)) {
    return NextResponse.next();
  }

  const token = request.cookies.get(SESSION_COOKIE_NAME)?.value;
  const user = token
    ? await getUserBySessionToken(token, { touch: false })
    : null;

  if (!user) {
    const isPage =
      request.headers.get("sec-fetch-dest") === "document" ||
      request.nextUrl.pathname.endsWith(".html");
    return isPage
      ? NextResponse.redirect(new URL("/login", request.url))
      : new NextResponse(null, { status: 401 });
  }

  const response = NextResponse.next();
  // Don't let the browser keep a copy it could reopen after logout.
  response.headers.set("Cache-Control", "private, no-store");
  return response;
}

export const config = {
  matcher: "/games/:path*",
};
