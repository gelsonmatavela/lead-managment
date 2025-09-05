import { NextRequest } from "next/server";
import createMiddleware from 'next-intl/middleware';
import { routing } from "./i18n/routing";

const intlMiddleware = createMiddleware(routing);

export default function middleware(req: NextRequest){
    const intlResponse = intlMiddleware(req);
    return intlResponse;
}

export const config = {
    matcher:
        '/((?!_next|.*\\.(?:png|jpg|jpeg|gif|webp|svg|ico|mp4|webm|ogg|mp3|wav|txt|json|xml)).*)',
}