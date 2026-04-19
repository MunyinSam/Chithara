// ─── Domain Models ────────────────────────────────────────────────────────────
// Mirror of backend Django models / serializers

export interface Song {
	id: number;
	title: string;
	genre: string;
	prompt: string;
	audio_file: string;
	created_at: string;
	privacy_status: 'PUBLIC' | 'PRIVATE';
	share_token: string | null;
}

export interface GenerationResult {
	history_id: number;
	task_id: string;
	status: string;
}

export interface HistoryEntry {
	id: number;
	status: string;
	prompt_used: string;
	created_at: string;
	error_message?: string;
	song?: Pick<Song, 'id' | 'title' | 'genre' | 'audio_file'>;
}

export interface UserStats {
	total_songs: number;
	public_songs: number;
	total_generations: number;
}

export interface Credits {
	credits: number;
}
