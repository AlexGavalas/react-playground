export default {
    testEnvironment: 'jsdom',
    setupFilesAfterEnv: ['<rootDir>/src/setupTests.ts'],
    preset: 'ts-jest',
    globals: {
        'ts-jest': {
            isolatedModules: true,
        },
    },
};
