module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  roots: ['<rootDir>/src'],
  transform: {
    '^.+\\.tsx?$': 'ts-jest'
  },
  moduleNameMapper: {
    '^@core/(.*)$': '<rootDir>/src/core/$1',
    '^@integration/(.*)$': '<rootDir>/src/integration/$1',
    '^@prompts/(.*)$': '<rootDir>/src/prompts/$1',
    '^@orchestration/(.*)$': '<rootDir>/src/orchestration/$1'
  },
  coverageDirectory: 'coverage',
  collectCoverageFrom: ['src/**/*.{ts,tsx}', '!src/**/*.d.ts']
};
