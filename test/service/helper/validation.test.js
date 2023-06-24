const ValidationHelperService = require('../../../src/service/helper/validation.helper.service');

describe('ValidationHelperService', () => {
  let loggerService;
  let configService;
  let validationHelperService;

  const testValues = {
    validConfig: '{"foo":"bar"}',
    invalidConfig: 'invalid json',
  };

  beforeEach(() => {
    loggerService = {
      logSystem: jest.fn(),
      logSuccess: jest.fn(),
      logError: jest.fn(),
    };
    configService = {
      GetAllConfigs: jest.fn(() => [
        { Name: 'config1', Content: JSON.stringify({ foo: 'bar' }) },
        { Name: 'config2', Content: JSON.stringify({ baz: 'qux' }) },
      ]),
    };
    validationHelperService = new ValidationHelperService(loggerService, configService);
  });

  describe('validateConfig', () => {
    it('should throw an error if config is null', () => {
      expect(() => validationHelperService.validateConfig(null)).toThrow('Config is null or undefined.');
    });

    it('should throw an error if config is undefined', () => {
      expect(() => validationHelperService.validateConfig(undefined)).toThrow('Config is null or undefined.');
    });

    // it('should throw an error if JSON parsing fails', () => {
<<<<<<< Updated upstream
    //   expect(() => validationHelperService.validateConfig(testValues.invalidConfig)).toThrow('Error parsing config:');
=======
    //   expect(() => validationHelperService.validateConfig('invalid json')).toThrow('Error parsing config:');
>>>>>>> Stashed changes
    // });

    it('should not throw an error if config is valid', () => {
      expect(() => validationHelperService.validateConfig(testValues.validConfig)).not.toThrow();
    });
  });

  describe('validateAll', () => {
    it('should validate all configs', async () => {
      await validationHelperService.validateAll();
      expect(loggerService.logSystem).toHaveBeenCalledWith('Starting config validation...');
      expect(loggerService.logSuccess).toHaveBeenCalledWith('Validation succeeded for config: config1');
      expect(loggerService.logSuccess).toHaveBeenCalledWith('Validation succeeded for config: config2');
      expect(loggerService.logError).not.toHaveBeenCalled();
      expect(loggerService.logSystem).toHaveBeenCalledWith('Completed config validation.');
    });
  });
});