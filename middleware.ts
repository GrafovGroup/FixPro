import {NextResponse,type NextRequest} from 'next/server';
export function middleware(request:NextRequest){const h=new Headers(request.headers);h.set('x-fixpro-language',/^\/fr(?:\/|$)/.test(request.nextUrl.pathname)?'fr':'en');return NextResponse.next({request:{headers:h}});}
export const config={matcher:['/((?!api|_next|images|fonts|favicon).*)']};
