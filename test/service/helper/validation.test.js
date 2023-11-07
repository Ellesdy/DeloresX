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

    it('should throw an error if JSON parsing fails', () => {
      expect(() => validationHelperService.validateConfig('invalid json')).toThrow('Error parsing config: "invalid json" is not valid JSON');
    });

    it('should not throw an error if config is valid', () => {
      expect(() => validationHelperService.validateConfig(testValues.validConfig)).not.toThrow();
    });
  });
});
