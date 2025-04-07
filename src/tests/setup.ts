import { jest } from '@jest/globals';

// Mock console methods to reduce noise in test output
global.console = {
    ...console,
    log: jest.fn(),
    error: jest.fn(),
    warn: jest.fn(),
    info: jest.fn(),
    debug: jest.fn(),
};

// Set test timeout to 10 seconds
jest.setTimeout(10000); 