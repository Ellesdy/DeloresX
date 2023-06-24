const StartupService = require('../../../src/service/system/startup.service');

describe('StartupService', () => {
  let startupService;

  beforeEach(() => {
    const clientService = {
      login: jest.fn()
    };
    const lifecycleHelperService = {
      setupListeners: jest.fn()
    };
    const validationHelperService = {
      validateAll: jest.fn()
    };
    const commandService = {};

    startupService = new StartupService(clientService, lifecycleHelperService, validationHelperService, commandService);
  });

  describe('init', () => {
    it('should call validation, lifecycle setup, and login', async () => {
      await startupService.init();

      expect(startupService.validationHelperService.validateAll).toHaveBeenCalled();
      expect(startupService.lifecycleHelperService.setupListeners).toHaveBeenCalled();
      expect(startupService.clientService.login).toHaveBeenCalled();
    });
  });
});