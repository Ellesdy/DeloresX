const CommandService = require('../../../../src/service/library/discordjs/command.service');
const ClientService = require('../../../../src/service/library/discordjs/client.service');
const REST = require('@discordjs/rest').REST;
const { Routes } = require('discord-api-types/v9');

jest.mock('../../../../src/service/library/discordjs/client.service', () => {
  return jest.fn().mockImplementation(() => {
    return {
      client: {
        user: {
          id: 'bot-id'
        }
      },
      getBotToken: jest.fn().mockReturnValue('mock-bot-token')
    };
  });
});

describe('CommandService', () => {
  let commandService;
  let mockClientService;

  beforeEach(() => {
    mockClientService = new ClientService();
    commandService = new CommandService(
      mockClientService,
      // ... other dependencies
    );
  });

  describe('registerCommands', () => {
    it('should register all commands in the config', async () => {
      const rest = new REST({ version: '9' }).setToken(mockClientService.getBotToken());
      await rest.put(
        Routes.applicationGuildCommands('bot-id', 'guild-id'),
        { body: [] },
      );
      // ... your assertions here
    });
  });
});
