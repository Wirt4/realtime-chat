const nextJest = require('next/jest');
const createJestConfig = nextJest({
    dir: "./"
});

const customJestConfig = {
    moduleDirectories: ['node_modules', '<rootDir>'],
    testEnvironment: 'jest-environment-jsdom',
    setupFiles: ['dotenv/config'],
    transform: {
        '^.+\\.(js|jsx|ts|tsx)$': ['babel-jest', { presets: ['next/babel'] }],
    },
    transformIgnorePatterns: [
        '/node_modules/(?!next-auth|@next-auth/upstash-redis-adapter|uuid/.*)', // Ensure uuid and other modules are transformed
    ],
    moduleNameMapper: {
        "^uuid$": "uuid", // Properly map uuid if needed
    },
};

module.exports = createJestConfig(customJestConfig);
