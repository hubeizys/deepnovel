import vue from '@vitejs/plugin-vue'
import path from 'node:path'
import { defineConfig } from 'vite'
import electron from 'vite-plugin-electron/simple'

// https://vitejs.dev/config/
export default defineConfig(({ command, mode }) => {
  const isElectron = mode === 'electron'
  
  const baseConfig = {
    plugins: [vue()],
    resolve: {
      alias: {
        '@': path.resolve(__dirname, 'src'),
      },
    },
  }

  if (isElectron) {
    return {
      ...baseConfig,
      plugins: [
        ...baseConfig.plugins,
        electron({
          main: {
            entry: 'electron/main.ts',
          },
          preload: {
            input: path.join(__dirname, 'electron/preload.ts'),
          },
          renderer: process.env.NODE_ENV === 'test' ? undefined : {},
        }),
      ],
    }
  }

  return baseConfig
})
