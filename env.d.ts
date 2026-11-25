/// <reference types="vite/client" />

interface ImportMetaEnv {
  /** Origin of the sync backend (api/progress.ts) when it isn't deployed with the app. */
  readonly VITE_SYNC_API_URL?: string
}
