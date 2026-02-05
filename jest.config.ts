import type { Config } from 'jest';

const config: Config = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  setupFiles: ['<rootDir>/tests/jest.setup.ts'],
  extensionsToTreatAsEsm: ['.ts'],
  
  moduleNameMapper: {
    '^(\\.{1,2}/.*)\\.js$': '$1',

    // 1. (NOVO) Para import exato: import ... from "config"
    '^config$': '<rootDir>/src/config/index.ts',

    // 2. Para imports com caminho: import ... from "config/index.js"
    '^config/(.*)\\.js$': '<rootDir>/src/config/$1.ts',
    
    // 3. Para variantes sem extensão: import ... from "config/database"
    '^config/(.*)$': '<rootDir>/src/config/$1',

    // 4. Interfaces
    '^interfaces$': '<rootDir>/src/interfaces/index.ts',
    
    // Outros aliases comuns (caso use)
    '^utils/(.*)$': '<rootDir>/src/utils/$1',
    '^schemas/(.*)\\.js$': '<rootDir>/src/schemas/$1.ts', 
  },

  transform: {
    '^.+\\.tsx?$': [
      'ts-jest',
      {
        useESM: true,
      },
    ],
  },
};

export default config;