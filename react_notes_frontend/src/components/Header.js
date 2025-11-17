import React from 'react';
import '../styles/theme.css';

/**
// PUBLIC_INTERFACE
 * Header
 * Elegant Champagne-themed app header.
 */
export default function Header() {
  return (
    <header className="header">
      <div className="container header-inner">
        <div className="brand">
          <div className="brand-badge" aria-hidden="true">QN</div>
          <div className="brand-title">
            <h1>Quick Notes</h1>
            <p>Capture thoughts gracefully</p>
          </div>
        </div>
        <div className="status" aria-label="Brand color legend">
          Champagne Theme
        </div>
      </div>
      <div className="container">
        <div className="header-accent" aria-hidden="true"></div>
      </div>
    </header>
  );
}
