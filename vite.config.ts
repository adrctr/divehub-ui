import { defineConfig, loadEnv } from 'vite'

export default defineConfig(({ mode }) => {
  // Load env file based on `mode` in the current working directory.
  // Set the third parameter to '' to load all env regardless of the
  // `VITE_` prefix.
  const env = loadEnv(mode, process.cwd(), '')
  console.log('mode', mode)
  console.log('env', env.VITE_API_URL)


  return {
    define: {
      // Provide an explicit app-level constant derived from an env var.
      API_URL: JSON.stringify(env.VITE_API_URL ?? 'https://localhost:7186')
    },
    // Example: use an env var to set the dev server port conditionally.
    server: {
    },
  }
})