import { supabase, setUserContext, isSupabaseConfigured } from './supabase';

export interface JournalEntry {
    id?: string;
    content: string;
    prompt?: string;
    logged_at: string;
}

export async function upsertUser(userId: number): Promise<void> {
    if (!isSupabaseConfigured) return;
    try {
        await setUserContext(userId);
        await supabase.from('users').upsert({ id: userId }, { onConflict: 'id' });
    } catch (e) {
        console.warn('DB: upsertUser failed:', e);
    }
}

export async function saveJournalEntry(userId: number, entry: JournalEntry) {
    if (!isSupabaseConfigured) {
        console.log('DB: Mock saving journal entry:', entry);
        return;
    }
    try {
        await setUserContext(userId);
        const { error } = await supabase.from('journal_entries').insert({
            user_id: userId,
            ...entry
        });
        if (error) throw error;
    } catch (e) {
        console.error('DB: saveJournalEntry failed:', e);
    }
}

export async function getJournalEntries(userId: number): Promise<JournalEntry[]> {
    if (!isSupabaseConfigured) return [];
    try {
        await setUserContext(userId);
        const { data, error } = await supabase
            .from('journal_entries')
            .select('*')
            .eq('user_id', userId)
            .order('logged_at', { ascending: false });

        if (error) throw error;
        return data || [];
    } catch (e) {
        console.error('DB: getJournalEntries failed:', e);
        return [];
    }
}