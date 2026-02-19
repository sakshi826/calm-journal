import { supabase, setUserContext, isSupabaseConfigured } from './supabase';

export interface JournalPrompt {
    id?: string;
    content: string;
    category?: string;
    is_active: boolean;
}

const MOCK_PROMPTS: JournalPrompt[] = [
    { content: 'What are you grateful for today?', category: 'Gratitude', is_active: true },
    { content: 'Describe a moment that made you smile recently.', category: 'Happiness', is_active: true }
];

export async function upsertUser(userId: number): Promise<void> {
    if (!isSupabaseConfigured) return;
    try {
        await setUserContext(userId);
        await supabase.from('users').upsert({ id: userId }, { onConflict: 'id' });
    } catch (e) {
        console.warn('DB: upsertUser failed:', e);
    }
}

export async function saveJournalPrompt(userId: number, prompt: JournalPrompt) {
    if (!isSupabaseConfigured) return;
    try {
        await setUserContext(userId);
        const { error } = await supabase.from('journal_prompts').insert({
            user_id: userId,
            ...prompt
        });
        if (error) throw error;
    } catch (e) {
        console.error('DB: saveJournalPrompt failed:', e);
    }
}

export async function getJournalPrompts(userId: number): Promise<JournalPrompt[]> {
    if (!isSupabaseConfigured) return MOCK_PROMPTS;
    try {
        await setUserContext(userId);
        const { data, error } = await supabase
            .from('journal_prompts')
            .select('*')
            .eq('user_id', userId);

        if (error) throw error;
        return data || MOCK_PROMPTS;
    } catch (e) {
        console.error('DB: getJournalPrompts failed:', e);
        return MOCK_PROMPTS;
    }
}