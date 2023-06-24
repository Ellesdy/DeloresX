const ClientService = require('../../../../src/service/library/discordjs/client.service');
const GuildService = require('../../../../src/service/library/discordjs/guild.service');

describe('GuildService', () => {
  let clientService;
  let guildService;

  beforeEach(() => {
    clientService = new ClientService();
    guildService = new GuildService(clientService);
  });

  describe('getGuild', () => {
    it('should return the guild with the specified ID', () => {
      const guildId = (process.env.GUILD_ID);
      const guildMock = { name: 'Test Guild', id: guildId };
      clientService.client.guilds.cache.get = jest.fn().mockReturnValue(guildMock);

      const result = guildService.getGuild();

      expect(clientService.client.guilds.cache.get).toHaveBeenCalledWith(guildId);
      expect(result).toBe(guildMock);
    });
  });
});