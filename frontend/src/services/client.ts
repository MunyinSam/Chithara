// Base API client — handles the base URL and auth headers centrally.

const BASE = process.env.NEXT_PUBLIC_API_BASE_URL ?? 'http://localhost:8000/api';

type RequestOptions = Omit<RequestInit, 'headers'> & {
	token?: string | null;
	extraHeaders?: Record<string, string>;
};

export async function apiRequest<T>(
	path: string,
	{ token, extraHeaders, ...init }: RequestOptions = {}
): Promise<T> {
	const headers: Record<string, string> = {
		'Content-Type': 'application/json',
		...extraHeaders,
	};
	if (token) headers['Authorization'] = `Bearer ${token}`;

	const res = await fetch(`${BASE}${path}`, { ...init, headers });
	if (!res.ok) throw new Error(`API ${init.method ?? 'GET'} ${path} failed: ${res.status}`);
	return res.json() as Promise<T>;
}
