import { apiRequest } from './client';
import type { Credits, GenerationResult, HistoryEntry } from '@/src/types';

export interface GenerateSongInput {
	prompt: string;
	style: string;
	title: string;
	instrumental: boolean;
}

export const generationService = {
	/** GET /generate/credits/ — remaining Suno credits */
	getCredits(token: string): Promise<Credits> {
		return apiRequest<Credits>('/generate/credits/', { token });
	},

	/** POST /generate/ — kick off a new song generation */
	generate(input: GenerateSongInput, token: string, sunoApiKey?: string): Promise<GenerationResult> {
		return apiRequest<GenerationResult>('/generate/', {
			method: 'POST',
			token,
			body: JSON.stringify(input),
			extraHeaders: sunoApiKey ? { 'X-Suno-API-Key': sunoApiKey } : undefined,
		});
	},

	/** GET /history/:id/ — poll a generation for status + result */
	getHistory(historyId: number, token: string): Promise<HistoryEntry> {
		return apiRequest<HistoryEntry>(`/history/${historyId}/`, { token });
	},
};
