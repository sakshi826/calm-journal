import { supabase, setUserContext } from './supabase';

export interface JournalEntry {
    id?: string;
    logged_at: string;
    title?: string;
    content: string;
    mood_before?: number;
    mood_after?: number;
    tags: string[];
    is_private: boolean;
    word_count?: number;
}

export interface JournalPrompt {
    id?: string;
    prompt_date: string;
    prompt_text: string;
    category?: string;
    used: boolean;
    response_id?: string;
}

export async function upsertUser(userId: number): Promise<void> {
    await setUserContext(userId);
    const { error } = await supabase.from('users').upsert({ id: userId }, { onConflict: 'id' });
    if (error) throw error;
}

export async function saveJournalEntry(userId: number, entry: JournalEntry) {
    await setUserContext(userId);
    const { error } = await supabase.from('journal_entries').insert({
        user_id: userId,
        ...entry
    });
    if (error) throw error;
}

export async function getJournalEntries(userId: number): Promise<JournalEntry[]> {
    await setUserContext(userId);
    const { data, error } = await supabase
        .from('journal_entries')
        .select('*')
        .eq('user_id', userId)
        .order('logged_at', { ascending: false });

    if (error) throw error;
    return data || [];
}

export async function deleteJournalEntry(userId: number, id: string) {
    await setUserContext(userId);
    const { error } = await supabase
        .from('journal_entries')
        .delete()
        .eq('id', id)
        .eq('user_id', userId);

    if (error) throw error;
}

export async function saveJournalPrompt(userId: number, prompt: JournalPrompt) {
    await setUserContext(userId);
    const { error } = await supabase.from('journal_prompts').insert({
        user_id: userId,
        ...prompt
    });
    if (error) throw error;
}

export async function getJournalPrompts(userId: number): Promise<JournalPrompt[]> {
    await setUserContext(userId);
    const { data, error } = await supabase
        .from('journal_prompts')
        .select('*')
        .eq('user_id', userId);

    if (error) throw error;
    return data || [];
}
