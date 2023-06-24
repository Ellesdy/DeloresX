const chalk = require('chalk');
const LoggerService = require('../../../src/service/system/logger.service');
const MessageService = require('../../../src/service/system/broadcast.service');

describe('LoggerService', () => {
  let loggerService;
  let messageServiceMock;

  beforeEach(() => {
    messageServiceMock = new MessageService();
    loggerService = new LoggerService(messageServiceMock);
    jest.useFakeTimers(); // Use Jest timer mock
  });

  afterEach(() => {
    jest.runOnlyPendingTimers(); // Run any pending timers
    jest.useRealTimers(); // Restore the real timers
  });

  describe('logSystem', () => {
    it('should log a system message', () => {
      const message = 'System message';
      const expectedOutput = `<${chalk.yellow('SYSTEM')}>: ${message} [${chalk.blueBright(new Date().toLocaleString('en-US').replace(",", ""))}]`;
      console.log = jest.fn();
      loggerService.logSystem(message);
      jest.advanceTimersByTime(1000); // Advance the time by 1 second
      expect(console.log).toHaveBeenCalledWith(expectedOutput);
    });
  });

  describe('logError', () => {
    it('should log an error message', () => {
      const errorMessage = 'An error occurred';
      const error = new Error(errorMessage);
      const expectedOutput = `<${chalk.red('ERROR')}>: ${errorMessage} [${chalk.blueBright(new Date().toLocaleString('en-US').replace(",", ""))}]`;
      console.log = jest.fn();
      loggerService.logError(error);
      jest.advanceTimersByTime(1000); // Advance the time by 1 second
      expect(console.log).toHaveBeenCalledWith(expectedOutput);
    });

    it('should not log anything if the argument is not an instance of Error', () => {
      console.log = jest.fn();
      loggerService.logError('This is not an Error object');
      jest.advanceTimersByTime(1000); // Advance the time by 1 second
      expect(console.log).not.toHaveBeenCalled();
    });
  });

  describe('logSuccess', () => {
    it('should log a success message', () => {
      const message = 'Success message';
      const expectedOutput = `<${chalk.green('SUCCESS')}>: ${message} [${chalk.blueBright(new Date().toLocaleString('en-US').replace(",", ""))}]`;
      console.log = jest.fn();
      loggerService.logSuccess(message);
      jest.advanceTimersByTime(1000); // Advance the time by 1 second
      expect(console.log).toHaveBeenCalledWith(expectedOutput);
    });
  });
});