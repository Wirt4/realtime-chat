const nextJest = require('next/jest')
const createJestConfig = nextJest({
    dir:"./"
})
const customJestConfig = {
    moduleDirectories:['node_modules', "<rootDir>"],
    testEnvironment: 'jest-environment-jsdom',
    setupFiles: ['dotenv/config'],
    transform: {
        '^.+\\.(js|jsx|ts|tsx)$': ['babel-jest', { presets: ['next/babel'] }],
    },
    transformIgnorePatterns: [
        "/node_modules/(?!next-auth|@next-auth/upstash-redis-adapter|uuid)",  // Add any other problematic packages here
    ],
}

module.exports = createJestConfig(customJestConfig)
