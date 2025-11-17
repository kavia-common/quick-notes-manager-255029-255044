import { addNote, fetchNotes, deleteNote, isSupabaseEnabled } from './notesService';

describe('notesService local storage path', () => {
  const originalGetItem = window.localStorage.getItem;
  const originalSetItem = window.localStorage.setItem;

  beforeEach(() => {
    // Ensure envs absent for this test to trigger local path
    process.env.REACT_APP_SUPABASE_URL = '';
    process.env.REACT_APP_SUPABASE_KEY = '';
    window.localStorage.clear();
  });

  afterAll(() => {
    window.localStorage.getItem = originalGetItem;
    window.localStorage.setItem = originalSetItem;
  });

  test('falls back to local storage when Supabase env missing', async () => {
    expect(isSupabaseEnabled()).toBe(false);
    const before = await fetchNotes();
    expect(before).toEqual([]);

    const note = await addNote('Hello world');
    expect(note.content).toBe('Hello world');

    const after = await fetchNotes();
    expect(after.length).toBe(1);

    const ok = await deleteNote(note.id);
    expect(ok).toBe(true);

    const finalList = await fetchNotes();
    expect(finalList.length).toBe(0);
  });
});
