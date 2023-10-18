class ValidationHelperService {
  constructor(loggerService, configService) {
    this.loggerService = loggerService;
    this.configService = configService;
  }

  logValidationStart(validationType) {
    this.loggerService.logSystem(`Starting ${validationType} validation...`);
  }

  logValidationSuccess(validationType, message) {
    this.loggerService.logSuccess(`Validation succeeded for ${validationType}: ${message}`);
  }

  logValidationFailure(validationType, message, error) {
    this.loggerService.logError(`Validation failed for ${validationType}: ${message}`, error);
  }

  logValidationEnd(validationType) {
    this.loggerService.logSystem(`Completed ${validationType} validation.`);
  }

  validateConfig(config) {
    if (config === null || config === undefined) {
      throw new Error('Config is null or undefined.');
    }

    try {
      return JSON.parse(config);
    } catch (e) {
      throw new Error(`Error parsing config: ${e.message}`);
    }
  }

  async validateAll() {
    const configs = this.configService.GetAllConfigs();
    this.logValidationStart('config');

    for (let config of configs) {
      try {
        this.validateConfig(config.Content);
        this.logValidationSuccess('config', config.Name);
      } catch (error) {
        this.logValidationFailure('config', config.Name, error);
      }
    }

    this.logValidationEnd('config');
  }
}

module.exports = ValidationHelperService;
