/// <reference types="vitest" />

import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react-swc';
//import react from '@vitejs/plugin-react';

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  test: {
    environment: 'jsdom',      // Simula o DOM para testes de componentes React
    globals: true,             // Permite usar funções como describe, it, expect sem importar
    setupFiles: './src/setupTests.ts', // (opcional) Arquivo para configurações globais de teste
    include: [
      'src/**/*.test.{ts,tsx}', 
      'src/**/__tests__/*.{ts,tsx}'
    ]
  },
})
