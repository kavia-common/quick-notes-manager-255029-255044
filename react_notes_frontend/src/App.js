import React, { useEffect, useMemo, useState } from 'react';
import './styles/theme.css';
import Header from './components/Header';
import Banner from './components/Banner';
import NoteInput from './components/NoteInput';
import NotesList from './components/NotesList';
import { addNote, deleteNote, fetchNotes, isSupabaseEnabled, flags as serviceFlags } from './services/notesService';
import { log } from './services/logger';

/**
// PUBLIC_INTERFACE
 * App
 * Single page Quick Notes application with Champagne theme.
 */
function App() {
  const [notes, setNotes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [opLoading, setOpLoading] = useState(false);
  const [error, setError] = useState('');

  const isOnline = isSupabaseEnabled();

  // Feature flags: allow override from REACT_APP_FEATURE_FLAGS
  const featureFlags = useMemo(() => ({
    enableCharacterCount: serviceFlags.enableCharacterCount,
    confirmOnDelete: serviceFlags.confirmOnDelete,
  }), []);

  async function load() {
    setLoading(true);
    setError('');
    try {
      const data = await fetchNotes();
      setNotes(data);
    } catch (e) {
      log.error('Failed to load notes', { error: String(e) });
      setError('Failed to load notes.');
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    load();
  }, []);

  async function handleAdd(content) {
    setOpLoading(true);
    setError('');
    try {
      const created = await addNote(content);
      setNotes((prev) => [created, ...prev]); // newest first
    } catch (e) {
      const msg = e?.message || 'Unable to add note.';
      setError(msg);
      log.error('Add note failed', { error: String(e) });
    } finally {
      setOpLoading(false);
    }
  }

  async function handleDelete(id) {
    setOpLoading(true);
    setError('');
    try {
      await deleteNote(id);
      setNotes((prev) => prev.filter((n) => n.id !== id));
    } catch (e) {
      setError('Unable to delete note.');
      log.error('Delete note failed', { error: String(e) });
    } finally {
      setOpLoading(false);
    }
  }

  return (
    <div>
      <Header />
      <main className="container" style={{ display: 'grid', gap: 16 }}>
        {!isOnline && (
          <Banner kind="info">
            Offline mode: Supabase not configured. Notes are stored locally in your browser.
          </Banner>
        )}
        <NoteInput
          onAdd={handleAdd}
          enableCharacterCount={featureFlags.enableCharacterCount}
          maxLength={280}
          loading={opLoading}
        />
        <NotesList
          notes={notes}
          onDelete={handleDelete}
          confirmOnDelete={featureFlags.confirmOnDelete}
          loading={loading}
          error={error}
        />
      </main>
      <div className="container" style={{ paddingBottom: 28, opacity: 0.7 }}>
        <div className="status">
          Data source: {isOnline ? 'Supabase' : 'Local Storage'} • Items: {notes.length}
        </div>
      </div>
    </div>
  );
}

export default App;
