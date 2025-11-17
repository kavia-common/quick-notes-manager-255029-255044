/* eslint-disable no-undef */
import { log } from './logger';

/**
// PUBLIC_INTERFACE
 * getSupabaseClient
 * Creates and returns a Supabase client if valid env vars are present, else returns null.
 * No secrets are hardcoded; reads from process.env.
 */
export function getSupabaseClient() {
  const url = process.env.REACT_APP_SUPABASE_URL;
  const key = process.env.REACT_APP_SUPABASE_KEY;

  if (!url || !key) {
    log.warn('Supabase env vars missing. Running in offline mode with localStorage.');
    return null;
  }

  try {
    // Dynamically import to avoid bundling when not used
    // This also prevents runtime errors if dependency resolution changes.
    // We rely on CRA tree-shaking to keep size small.
    // eslint-disable-next-line global-require, import/no-extraneous-dependencies
    const { createClient } = require('@supabase/supabase-js');
    const client = createClient(url, key);
    return client;
  } catch (e) {
    log.error('Failed to initialize Supabase client. Falling back to localStorage.', { error: String(e) });
    return null;
  }
}
