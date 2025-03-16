import type { Config } from '@jest/types';

const config: Config.InitialOptions = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  testTimeout: 10000,
  transform: {
    '^.+\\.ts$': 'ts-jest'
  }
};

export default config; 