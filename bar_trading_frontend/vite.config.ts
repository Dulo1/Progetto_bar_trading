// vite.config.ts
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'
import tailwindcss from '@tailwindcss/vite' // <-- Importa il nuovo plugin

export default defineConfig({
  plugins: [
    react(),
    tailwindcss(), // <-- Aggiungi il plugin qui
  ],
})