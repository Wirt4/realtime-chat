const nextJest = require('next/jest');
const createJestConfig = nextJest({
    dir: "./"
});

const customJestConfig = {
    moduleDirectories: ['node_modules', '<rootDir>'],
    testEnvironment: 'jest-environment-jsdom',
    setupFiles: ['dotenv/config'],
    setupFilesAfterEnv: ['<rootDir>/jest.setup.ts'],
    transform: {
        '^.+\\.(js|jsx|ts|tsx)$': ['babel-jest', { presets: ['next/babel'] }],
    },
    transformIgnorePatterns: [
        '/node_modules/(?!next-auth|@next-auth/upstash-redis-adapter|uuid/.*)', // Ensure uuid and other modules are transformed
    ],
    moduleNameMapper: {
        "^uuid$": "uuid"
    },
};

module.exports = createJestConfig(customJestConfig);
