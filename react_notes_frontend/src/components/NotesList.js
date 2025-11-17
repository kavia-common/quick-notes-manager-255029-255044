import React from 'react';
import '../styles/theme.css';
import NoteItem from './NoteItem';

/**
// PUBLIC_INTERFACE
 * NotesList
 * Displays notes or empty state.
 */
export default function NotesList({ notes, onDelete, confirmOnDelete = true, loading = false, error = '' }) {
  if (loading) {
    return <div className="card loader">Loading notes…</div>;
  }
  if (error) {
    return <div className="card error" role="alert">Error: {error}</div>;
  }
  if (!notes || notes.length === 0) {
    return (
      <div className="card empty">
        No notes yet. Write your first thought above ✨
      </div>
    );
  }
  return (
    <div className="notes-section" role="list" aria-label="Notes">
      <div className="card" style={{ display: 'grid', gap: 12 }}>
        {notes.map((n) => (
          <NoteItem
            key={n.id}
            note={n}
            onDelete={onDelete}
            confirmOnDelete={confirmOnDelete}
          />
        ))}
      </div>
    </div>
  );
}
