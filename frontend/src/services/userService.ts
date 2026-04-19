import { apiRequest } from './client';
import type { UserStats } from '@/src/types';

export const userService = {
	/** GET /users/:id/stats/ — aggregate stats for profile page */
	getStats(userId: number): Promise<UserStats> {
		return apiRequest<UserStats>(`/users/${userId}/stats/`);
	},
};
