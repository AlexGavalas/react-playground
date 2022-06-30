import type { Config } from 'jest';

const config: Config = {
    testEnvironment: 'jsdom',

    setupFilesAfterEnv: ['<rootDir>/src/setupTests.ts'],

    preset: 'ts-jest',

    globals: {
        'ts-jest': {
            isolatedModules: true,
        },
    },
};

export default config;
