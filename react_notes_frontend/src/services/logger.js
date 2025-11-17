/**
 * Simple centralized logger for the frontend.
 * Avoid logging sensitive info. In production we can wire to a provider.
 */
export const log = {
  info: (message, meta = {}) => {
    // eslint-disable-next-line no-console
    console.info(`[INFO] ${message}`, meta);
  },
  warn: (message, meta = {}) => {
    // eslint-disable-next-line no-console
    console.warn(`[WARN] ${message}`, meta);
  },
  error: (message, meta = {}) => {
    // eslint-disable-next-line no-console
    console.error(`[ERROR] ${message}`, meta);
  },
};
