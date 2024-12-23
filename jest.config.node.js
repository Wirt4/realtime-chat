const nextJest = require('next/jest');
const createJestConfig = nextJest({
    dir: "./"
});

const customJestConfig = {
    moduleDirectories: ['node_modules', '<rootDir>'],
    testEnvironment: 'node',
    setupFiles: ['dotenv/config'],
    setupFilesAfterEnv: ['<rootDir>/jest.setup.ts'],
    transform: {
        '^.+\\.(js|jsx|ts|tsx)$': ['babel-jest', { presets: ['next/babel', '@babel/preset-env', '@babel/preset-typescript'] }],
    },
    transformIgnorePatterns: [
        '/node_modules/(?!next-auth|@next-auth/upstash-redis-adapter|uuid/.*|jose/.*)', // Ensure uuid, jose, and other modules are transformed
    ],
    moduleNameMapper: {
        "^uuid$": "uuid",
        "^@/(.*)$": "<rootDir>/src/$1",
        "^jose-node-cjs-runtime/(.*)$": "jose-node-cjs-runtime/dist/node/cjs/$1"
    },
};

module.exports = createJestConfig(customJestConfig);
