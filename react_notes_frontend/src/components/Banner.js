import React from 'react';
import '../styles/theme.css';

/**
// PUBLIC_INTERFACE
 * Banner
 * Displays informational messages, including offline/local mode.
 * @param {string} kind - 'info' | 'warning' | 'error'
 * @param {React.ReactNode} children - content
 */
export default function Banner({ kind = 'info', children }) {
  const style = {
    info: { borderColor: '#F59E0B', background: '#FFFBEB', color: '#92400E' },
    warning: { borderColor: '#FCD34D', background: '#FEF3C7', color: '#92400E' },
    error: { borderColor: '#FCA5A5', background: '#FEE2E2', color: '#7F1D1D' },
  }[kind] || {};

  return (
    <div
      className="banner"
      style={{
        borderStyle: 'dashed',
        borderWidth: 1,
        ...style,
      }}
      role={kind === 'error' ? 'alert' : 'status'}
      aria-live="polite"
    >
      {children}
    </div>
  );
}
