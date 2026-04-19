import { apiRequest } from './client';
import type { Song } from '@/src/types';

export const songService = {
	/** GET /songs/ — authenticated user's full library */
	getAll(token: string): Promise<Song[]> {
		return apiRequest<Song[] | { results: Song[] }>('/songs/', { token }).then(
			(data) => (Array.isArray(data) ? data : (data.results ?? []))
		);
	},

	/** GET /songs/public/:token/ — unauthenticated public share page */
	getPublic(shareToken: string): Promise<Song> {
		return apiRequest<Song>(`/songs/public/${shareToken}/`);
	},

	/** PATCH /songs/:id/ — toggle privacy status */
	updatePrivacy(id: number, privacy_status: 'PUBLIC' | 'PRIVATE', token: string): Promise<Song> {
		return apiRequest<Song>(`/songs/${id}/`, {
			method: 'PATCH',
			token,
			body: JSON.stringify({ privacy_status }),
		});
	},
};
