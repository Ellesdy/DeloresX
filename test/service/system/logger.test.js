const chalk = require('chalk');
const LoggerService = require('../../../src/service/system/logger.service');
const MessageService = require('../../../src/service/system/broadcast.service');

// Mock the chalk library for consistent coloring
jest.mock('chalk', () => ({
  yellow: jest.fn((text) => `<yellow>${text}</yellow>`),
  red: jest.fn((text) => `<red>${text}</red>`),
  green: jest.fn((text) => `<green>${text}</green>`),
  blueBright: jest.fn((text) => `<blueBright>${text}</blueBright>`),
}));

describe('LoggerService', () => {
  let loggerService;
  let messageServiceMock;

  beforeEach(() => {
    // Mock the MessageService if it's used within the LoggerService
    messageServiceMock = {
      broadcastMessage: jest.fn(),
      // ... other methods if they exist
    };
    loggerService = new LoggerService(messageServiceMock);
    jest.spyOn(global.console, 'log').mockImplementation(() => {});
  });

  afterEach(() => {
    jest.clearAllMocks(); // Clears any mocks and their calls
  });

  describe('logSystem', () => {
    it('should log a system message', () => {
      const message = 'System message';
      const expectedOutput = `<yellow>SYSTEM</yellow>: ${message} [<blueBright>${new Date().toLocaleString('en-US').replace(",", "")}</blueBright>]`;
      loggerService.logSystem(message);
      expect(console.log).toHaveBeenCalledWith(expectedOutput);
    });
  });

  describe('logError', () => {
    it('should log an error message', () => {
      const errorMessage = 'An error occurred';
      const error = new Error(errorMessage);
      const expectedOutput = `<red>ERROR</red>: ${errorMessage} [<blueBright>${new Date().toLocaleString('en-US').replace(",", "")}</blueBright>]`;
      loggerService.logError(error);
      expect(console.log).toHaveBeenCalledWith(expectedOutput);
    });

    it('should not log anything if the argument is not an instance of Error', () => {
      loggerService.logError('This is not an Error object');
      expect(console.log).not.toHaveBeenCalled();
    });
  });

  describe('logSuccess', () => {
    it('should log a success message', () => {
      const message = 'Success message';
      const expectedOutput = `<green>SUCCESS</green>: ${message} [<blueBright>${new Date().toLocaleString('en-US').replace(",", "")}</blueBright>]`;
      loggerService.logSuccess(message);
      expect(console.log).toHaveBeenCalledWith(expectedOutput);
    });
  });
});
