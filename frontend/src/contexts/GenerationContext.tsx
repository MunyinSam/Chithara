'use client';

import {
	createContext,
	useCallback,
	useContext,
	useRef,
	useState,
} from 'react';
import { generationService, type GenerateSongInput } from '@/src/services/generationService';
import type { HistoryEntry } from '@/src/types';

type GenStatus = 'idle' | 'loading' | 'polling' | 'done' | 'error';

export interface FormDraft {
	prompt: string;
	style: string;
	title: string;
	instrumental: boolean;
}

interface GenerationState {
	status: GenStatus;
	prompt: string;
	style: string;
	result: HistoryEntry | null;
	error: string;
	draft: FormDraft;
	setDraft: (patch: Partial<FormDraft>) => void;
	startGeneration: (input: GenerateSongInput, token: string, sunoApiKey?: string) => Promise<void>;
	dismiss: () => void;
}

const EMPTY_DRAFT: FormDraft = { prompt: '', style: '', title: '', instrumental: false };

const GenerationContext = createContext<GenerationState | null>(null);

export function GenerationProvider({ children }: { children: React.ReactNode }) {
	const [status, setStatus] = useState<GenStatus>('idle');
	const [prompt, setPrompt] = useState('');
	const [style, setStyle] = useState('');
	const [result, setResult] = useState<HistoryEntry | null>(null);
	const [error, setError] = useState('');
	const [draft, setDraftState] = useState<FormDraft>(EMPTY_DRAFT);
	const pollRef = useRef<ReturnType<typeof setInterval> | null>(null);

	const stopPolling = () => {
		if (pollRef.current) {
			clearInterval(pollRef.current);
			pollRef.current = null;
		}
	};

	const setDraft = useCallback((patch: Partial<FormDraft>) => {
		setDraftState((prev) => ({ ...prev, ...patch }));
	}, []);

	const startGeneration = useCallback(async (input: GenerateSongInput, token: string, sunoApiKey?: string) => {
		stopPolling();
		setPrompt(input.prompt);
		setStyle(input.style);
		setResult(null);
		setError('');
		setStatus('loading');

		try {
			const data = await generationService.generate(input, token, sunoApiKey);
			setStatus('polling');

			pollRef.current = setInterval(async () => {
				try {
					const entry = await generationService.getHistory(data.history_id, token);
					if (entry.status === 'COMPLETED') {
						stopPolling();
						setResult(entry);
						setStatus('done');
					} else if (entry.status === 'FAILED') {
						stopPolling();
						setError(entry.error_message ?? 'Generation failed.');
						setStatus('error');
					}
				} catch {
					stopPolling();
					setError('Failed to check generation status.');
					setStatus('error');
				}
			}, 3000);
		} catch (err: unknown) {
			setError(err instanceof Error ? err.message : 'Something went wrong.');
			setStatus('error');
		}
	}, []);

	const dismiss = useCallback(() => {
		stopPolling();
		setStatus('idle');
		setResult(null);
		setError('');
		setPrompt('');
		setStyle('');
		setDraftState(EMPTY_DRAFT);
	}, []);

	return (
		<GenerationContext.Provider value={{ status, prompt, style, result, error, draft, setDraft, startGeneration, dismiss }}>
			{children}
		</GenerationContext.Provider>
	);
}

export function useGeneration() {
	const ctx = useContext(GenerationContext);
	if (!ctx) throw new Error('useGeneration must be used inside GenerationProvider');
	return ctx;
}
