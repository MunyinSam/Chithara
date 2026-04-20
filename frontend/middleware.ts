import { auth } from '@/auth';
import { NextResponse } from 'next/server';

const PROTECTED_ROUTES = ['/generation', '/library'];

export default auth((req) => {
	const isProtected = PROTECTED_ROUTES.some((route) =>
		req.nextUrl.pathname.startsWith(route)
	);

	if (isProtected && !req.auth) {
		const loginUrl = new URL('/login', req.url);
		loginUrl.searchParams.set('callbackUrl', req.nextUrl.pathname);
		return NextResponse.redirect(loginUrl);
	}
});

export const config = {
	matcher: ['/generation/:path*', '/library/:path*'],
};
