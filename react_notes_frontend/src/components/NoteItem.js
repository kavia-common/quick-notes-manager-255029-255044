import React from 'react';
import '../styles/theme.css';

/**
// PUBLIC_INTERFACE
 * NoteItem
 * Renders a single note with content, timestamp, and delete action.
 */
export default function NoteItem({ note, onDelete, confirmOnDelete = true }) {
  const { id, content, created_at } = note;

  function handleDelete() {
    if (confirmOnDelete) {
      // Simple confirm; can be replaced by modal if needed.
      // eslint-disable-next-line no-alert
      const ok = window.confirm('Delete this note?');
      if (!ok) return;
    }
    onDelete(id);
  }

  const date = new Date(created_at);
  const readable = isNaN(date.getTime()) ? created_at : date.toLocaleString();

  return (
    <div className="note-item" role="listitem" aria-label="Note item">
      <div>
        <div className="note-content">{content}</div>
        <div className="note-meta">
          <span>Created</span>
          <span aria-label="Created at">{readable}</span>
        </div>
      </div>
      <div>
        <button className="delete-btn" onClick={handleDelete} aria-label="Delete note">
          Delete
        </button>
      </div>
    </div>
  );
}
