import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'
import tailwindcss from '@tailwindcss/vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(),tailwindcss()],
  test: {
    environment: 'jsdom',
    include: ['**/*.test.tsx'],
    coverage: {
      // you can include other reporters, but 'json-summary' is required, json is recommended
      reporter: ['text', 'json-summary', 'json'],
      // If you want a coverage reports even if your tests are failing, include the reportOnFailure option
      reportOnFailure: true,
      thresholds: {
      lines: 100,
      branches: 100,
      functions: 100,
      statements: 100
      }
    },
  },
  base: '/StudentSymposiumSoftware/',
  build: {
    watch: { include: ['/*.css', './*.css', '/src/*.css'] }
  },
})
