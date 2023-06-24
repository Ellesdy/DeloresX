const CommandService = require('../../../../src/service/library/discordjs/command.service');

describe('CommandService', () => {
  describe('registerCommands', () => {
    it('should register all commands in the config', async () => {
      // Create mock objects for the required dependencies
      const mockConfigService = {
        Command: {
          commands: {
            ping: {
              name: 'ping',
              description: 'Ping the bot',
            },
            hello: {
              name: 'hello',
              description: 'Say hello to the bot',
            },
          },
        },
      };
      const mockGuild = {
        commands: {
          create: jest.fn(),
        },
      };
      const mockGuildService = {
        getGuild: jest.fn().mockResolvedValue(mockGuild),
      };
      const mockLoggerService = {
        logSystem: jest.fn(),
        logSuccess: jest.fn(),
      };
      const mockMessageService = {
        Messages: {
          command: {
            register: {
              prefix: 'REGISTER',
              start: 'START',
              success: 'SUCCESS',
            },
          },
        },
      };
      const mockValidationHelperService = {
        validateConfig: jest.fn(),
      };

      // Create a new instance of the CommandService with the mock dependencies
      const commandService = new CommandService(
        mockConfigService,
        null,
        mockGuildService,
        mockMessageService,
        mockLoggerService,
        mockValidationHelperService,
        null,
        null
      );

      // Call the registerCommands function
      await commandService.registerCommands();

      // Assert that the guild.commands.create method was called for each command in the config
      expect(mockGuild.commands.create).toHaveBeenCalledTimes(2);
      expect(mockGuild.commands.create).toHaveBeenCalledWith({
        name: 'ping',
        description: 'Ping the bot',
      });
      expect(mockGuild.commands.create).toHaveBeenCalledWith({
        name: 'hello',
        description: 'Say hello to the bot',
      });

      // Assert that the other services were called correctly
      expect(mockValidationHelperService.validateConfig).toHaveBeenCalled();
      expect(mockLoggerService.logSystem).toHaveBeenCalled();
      expect(mockLoggerService.logSuccess).toHaveBeenCalled();
      expect(mockLoggerService.logSuccess).toHaveBeenCalled();
      expect(mockLoggerService.logSuccess).toHaveBeenCalled();
    });
  });
});