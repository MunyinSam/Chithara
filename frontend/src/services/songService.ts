import { apiRequest } from './client';
import type { PaginatedResponse, Song } from '@/src/types';

export type SortOption = 'newest' | 'oldest' | 'title_asc' | 'title_desc';

const SORT_MAP: Record<SortOption, string> = {
	newest:     '-created_at',
	oldest:     'created_at',
	title_asc:  'title',
	title_desc: '-title',
};

export const songService = {
	/** GET /songs/ — paginated, searchable, sortable library */
	getPage(
		token: string,
		page = 1,
		filter?: 'PUBLIC' | 'PRIVATE',
		search?: string,
		sort: SortOption = 'newest',
	): Promise<PaginatedResponse<Song>> {
		const params = new URLSearchParams({ page: String(page), ordering: SORT_MAP[sort] });
		if (filter) params.set('privacy_status', filter);
		if (search?.trim()) params.set('search', search.trim());
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

	/** DELETE /songs/:id/ */
	delete(id: number, token: string): Promise<void> {
		return apiRequest<void>(`/songs/${id}/`, { method: 'DELETE', token });
	},
};
