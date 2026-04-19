import { apiRequest } from './client';
import type { PaginatedResponse, Song } from '@/src/types';

export const songService = {
	/** GET /songs/ — paginated library, 4 per page */
	getPage(
		token: string,
		page = 1,
		filter?: 'PUBLIC' | 'PRIVATE',
	): Promise<PaginatedResponse<Song>> {
		const params = new URLSearchParams({ page: String(page) });
		if (filter) params.set('privacy_status', filter);
		return apiRequest<PaginatedResponse<Song>>(`/songs/?${params}`, { token });
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
