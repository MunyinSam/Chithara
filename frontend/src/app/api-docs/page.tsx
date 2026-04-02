'use client';

import dynamic from 'next/dynamic';

const SwaggerUI = dynamic(() => import('swagger-ui-react'), { ssr: false });

const schemaUrl =
	process.env.NEXT_PUBLIC_API_SCHEMA_URL ??
	'http://127.0.0.1:8080/api/schema/';

export default function ApiDocsPage() {
	return (
		<>
			<link
				rel="stylesheet"
				href="https://unpkg.com/swagger-ui-dist/swagger-ui.css"
			/>
			<main className="min-h-screen bg-white px-4 py-6 md:px-8">
				<div className="mx-auto max-w-6xl rounded-2xl border border-black/10 bg-white p-3 shadow-sm md:p-5">
					<SwaggerUI
						url={schemaUrl}
						docExpansion="list"
						defaultModelsExpandDepth={1}
					/>
				</div>
			</main>
		</>
	);
}
