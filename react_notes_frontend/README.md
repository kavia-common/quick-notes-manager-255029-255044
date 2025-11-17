# Quick Notes - React Frontend (Champagne Theme)

An elegant single-page React app to quickly create, view, and delete short text notes.
Uses Supabase when configured and gracefully falls back to localStorage otherwise.

## Features

- Champagne visual theme (primary #D97706, background #FFFBEB, surface #FFFFFF, text #374151)
- Add notes with optional character count (default 280)
- List notes (newest first) with created timestamp
- Delete notes with optional confirmation
- Supabase integration (CRUD to `notes` table) when env vars present
- LocalStorage fallback with visible offline banner when Supabase is not configured
- Responsive, accessible UI, rounded cards, subtle shadows
- Basic unit test for local storage flow

## Getting Started

1) Install dependencies

```bash
npm install
```

2) Configure environment (optional for offline/local mode)

Create `.env` file based on `.env.example`. If you omit Supabase vars, the app runs in local mode.

3) Start development server

```bash
npm start
```

Open http://localhost:3000.

## Environment Variables

See `.env.example` for reference.

- REACT_APP_SUPABASE_URL: Your Supabase project URL
- REACT_APP_SUPABASE_KEY: Your Supabase anon/public API key
- REACT_APP_FEATURE_FLAGS: JSON string for optional flags, e.g.
  `{"enableCharacterCount": true, "confirmOnDelete": true}`

If REACT_APP_SUPABASE_URL or REACT_APP_SUPABASE_KEY is missing, the app shows a banner and uses localStorage.

## Supabase Setup

If you want to persist notes with Supabase:

1) Create a table `notes`:

```sql
create table if not exists public.notes (
  id uuid primary key default gen_random_uuid(),
  content text not null,
  created_at timestamp with time zone default now()
);
```

2) Configure Row Level Security (RLS) as appropriate for your environment (for demos, you can allow anonymous select/insert/delete).

3) Set env vars in `.env`:

```
REACT_APP_SUPABASE_URL= https://YOUR-PROJECT.supabase.co
REACT_APP_SUPABASE_KEY= YOUR_ANON_PUBLIC_KEY
```

Start the app and it will use Supabase automatically.

## Feature Flags

Use `REACT_APP_FEATURE_FLAGS` (JSON) to control:

- enableCharacterCount (default true)
- confirmOnDelete (default true)

Example:

```
REACT_APP_FEATURE_FLAGS={"enableCharacterCount":true,"confirmOnDelete":true}
```

## Security Notes

- No secrets are hardcoded; only read from process.env.
- Input is trimmed and treated as plain text (no HTML rendering).
- Centralized logger avoids leaking sensitive info.

## Tests

Run tests:

```bash
npm test
```

Includes a smoke test for App and a unit test for local storage path in notesService.

## Project Structure

- src/components: Header, Banner, NoteInput, NoteItem, NotesList
- src/services: logger, supabaseClient (lazy init), notesService (storage abstraction)
- src/styles/theme.css: Champagne theme styles
- src/App.js: SPA composition
- src/index.js: Entrypoint
