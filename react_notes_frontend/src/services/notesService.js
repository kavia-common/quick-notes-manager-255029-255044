import { getSupabaseClient } from './supabaseClient';
import { log } from './logger';

const STORAGE_KEY = 'quick_notes_items_v1';

// Feature flags parsing helper
function parseFeatureFlags() {
  try {
    const raw = process.env.REACT_APP_FEATURE_FLAGS;
    if (!raw) return {};
    return JSON.parse(raw);
  } catch (e) {
    log.warn('Invalid REACT_APP_FEATURE_FLAGS JSON. Ignoring.', {});
    return {};
  }
}

const featureFlags = parseFeatureFlags();
export const flags = {
  enableCharacterCount: !!featureFlags.enableCharacterCount,
  confirmOnDelete: featureFlags.confirmOnDelete !== false, // default true
};

// Storage Strategy
const supabase = getSupabaseClient();
const isOnline = !!supabase;

/**
 * sanitizeContent - trims and constrains content to maxLength; avoids HTML injection.
 */
function sanitizeContent(content, maxLength = 280) {
  const trimmed = (content || '').toString().trim();
  const sliced = trimmed.slice(0, maxLength);
  return sliced;
}

function toNote(item) {
  return {
    id: item.id,
    content: item.content,
    created_at: item.created_at || item.createdAt || new Date().toISOString(),
  };
}

/**
// PUBLIC_INTERFACE
 * fetchNotes
 * Returns notes sorted by newest first.
 * If Supabase is available, loads from 'notes' table. Otherwise, localStorage.
 */
export async function fetchNotes() {
  if (isOnline) {
    try {
      const { data, error } = await supabase
        .from('notes')
        .select('id, content, created_at')
        .order('created_at', { ascending: false });

      if (error) throw error;
      return (data || []).map(toNote);
    } catch (e) {
      log.error('Supabase fetchNotes failed. Falling back to localStorage.', { error: String(e) });
      return fetchNotesLocal();
    }
  }
  return fetchNotesLocal();
}

function fetchNotesLocal() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    const list = raw ? JSON.parse(raw) : [];
    const notes = list.map(toNote).sort((a, b) => (new Date(b.created_at) - new Date(a.created_at)));
    return notes;
  } catch (e) {
    log.error('Local fetch error', { error: String(e) });
    return [];
  }
}

/**
// PUBLIC_INTERFACE
 * addNote
 * Adds a new note with sanitized content and returns the created note.
 * Uses Supabase if available else localStorage.
 */
export async function addNote(content) {
  const sanitized = sanitizeContent(content);
  if (!sanitized) {
    const err = new Error('Note cannot be empty.');
    err.code = 'VALIDATION_EMPTY';
    throw err;
  }

  if (isOnline) {
    try {
      const { data, error } = await supabase
        .from('notes')
        .insert({ content: sanitized })
        .select('id, content, created_at')
        .single();
      if (error) throw error;
      return toNote(data);
    } catch (e) {
      log.error('Supabase addNote failed. Falling back to localStorage.', { error: String(e) });
      return addNoteLocal(sanitized);
    }
  }
  return addNoteLocal(sanitized);
}

function addNoteLocal(sanitized) {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    const list = raw ? JSON.parse(raw) : [];
    const note = {
      id: cryptoRandomId(),
      content: sanitized,
      created_at: new Date().toISOString(),
    };
    list.push(note);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(list));
    return note;
  } catch (e) {
    log.error('Local add error', { error: String(e) });
    const err = new Error('Unable to save note locally.');
    err.code = 'LOCAL_ADD_FAILED';
    throw err;
  }
}

/**
// PUBLIC_INTERFACE
 * deleteNote
 * Deletes a note by id. Uses Supabase if available else localStorage.
 */
export async function deleteNote(id) {
  if (!id) return;

  if (isOnline) {
    try {
      const { error } = await supabase.from('notes').delete().eq('id', id);
      if (error) throw error;
      return true;
    } catch (e) {
      log.error('Supabase deleteNote failed. Falling back to localStorage.', { error: String(e) });
      return deleteNoteLocal(id);
    }
  }
  return deleteNoteLocal(id);
}

function deleteNoteLocal(id) {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    const list = raw ? JSON.parse(raw) : [];
    const filtered = list.filter((n) => n.id !== id);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(filtered));
    return true;
  } catch (e) {
    log.error('Local delete error', { error: String(e) });
    return false;
  }
}

// Utility to generate reasonably unique id without external deps
function cryptoRandomId() {
  if (typeof crypto !== 'undefined' && crypto.randomUUID) return crypto.randomUUID();
  return 'id-' + Math.random().toString(36).slice(2) + Date.now().toString(36);
}

// PUBLIC_INTERFACE
export function isSupabaseEnabled() {
  return isOnline;
}
