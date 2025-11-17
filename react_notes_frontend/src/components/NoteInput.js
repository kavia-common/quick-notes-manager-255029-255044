import React, { useMemo, useState } from 'react';
import '../styles/theme.css';

/**
// PUBLIC_INTERFACE
 * NoteInput
 * Input row to add a new note. Emits onAdd(content).
 */
export default function NoteInput({ onAdd, enableCharacterCount = true, maxLength = 280, loading = false }) {
  const [value, setValue] = useState('');

  const remaining = useMemo(() => maxLength - value.length, [value, maxLength]);
  const counterClass = remaining < 0 ? 'error' : remaining <= 20 ? 'warn' : 'ok';
  const disabled = loading || !value.trim() || value.trim().length === 0;

  function handleChange(e) {
    // Avoid XSS by treating as plain text; we still allow typing past limit but show error.
    setValue(e.target.value);
  }

  function handleAdd() {
    const trimmed = value.trim();
    if (!trimmed) return;
    const content = trimmed.slice(0, maxLength);
    onAdd(content);
    setValue('');
  }

  function handleKey(e) {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      if (!disabled) handleAdd();
    }
  }

  return (
    <div className="card">
      <div className="input-wrap">
        <div className="input-row">
          <input
            className="input"
            placeholder="Write a quick note..."
            value={value}
            onChange={handleChange}
            onKeyDown={handleKey}
            aria-label="New note content"
          />
          <button
            className="button"
            onClick={handleAdd}
            disabled={disabled}
            aria-disabled={disabled}
            aria-label="Add note"
            title="Add note"
          >
            Add
          </button>
        </div>
        <div className="meta-row">
          <div className="hint">Press Enter to add</div>
          {enableCharacterCount && (
            <div className={`counter ${counterClass}`} aria-live="polite">
              {remaining} / {maxLength}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
