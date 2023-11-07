const GuildService = require('../../../../src/service/library/discordjs/guild.service');
const ConfigService = require('../../../../src/service/system/config.service');
const ClientService = require('../../../../src/service/library/discordjs/client.service');

jest.mock('../../../../src/service/system/config.service', () => {
  return jest.fn().mockImplementation(() => {
    return {
      System: {
        guildID: 'mock-guild-id'
      }
    };
  });
});

jest.mock('../../../../src/service/library/discordjs/client.service', () => {
  return jest.fn().mockImplementation(() => {
    return {
      client: {
        guilds: {
          cache: {
            get: jest.fn().mockReturnValue({ /* mock guild object */ })
          }
        }
      }
    };
  });
});

describe('GuildService', () => {
  let guildService;
  let mockConfigService;

  beforeEach(() => {
    mockConfigService = new ConfigService();
    guildService = new GuildService(mockConfigService);
  });

  describe('getGuild', () => {
    it('should return the guild with the specified ID', async () => {
      const guild = await guildService.getGuild();
      expect(guild).toBeDefined();
      expect(mockConfigService.System.guildID).toBe('mock-guild-id');
    });
  });
});
