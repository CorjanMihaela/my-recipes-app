import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
export default defineConfig({
  base: "/my-recipes-app/", // numele repo-ului tău
  plugins: [react()]
});
