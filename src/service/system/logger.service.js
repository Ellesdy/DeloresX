const chalk = require('chalk');
const MessageService = require('./broadcast.service'); // Updated import

const MessageCode = {
  SYSTEM: 'system',
  SUCCESS: 'success',
  ERROR: 'error',
  DEBUG: 'debug',
};

class LoggerService {
  constructor(messageService) {
    this.messageService = messageService;
  }

  logMessage(type, message, consoleColor) {
    const prefix = consoleColor(this.messageService.Messages.logging.prefix[type]);
    const logTime = chalk.blueBright(
      `${new Date().toLocaleDateString('en-US')} ${new Date().toLocaleTimeString('en-US')}`
    );
    console.log(`<${prefix}>: ${message} [${logTime}]`);
  }

  logSystem(message) {
    this.logMessage(MessageCode.SYSTEM, message, chalk.yellow);
  }

  logError(error) {
    if (error instanceof Error) {
      this.logMessage(MessageCode.ERROR, error.message, chalk.red);
    }
  }

  logSuccess(message) {
    this.logMessage(MessageCode.SUCCESS, message, chalk.green);
  }

}

module.exports = LoggerService;
