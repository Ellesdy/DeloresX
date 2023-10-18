const ConfigService = require('../../system/config.service.js');

class GuildService {
  constructor(clientService) {
    this.clientService = clientService;
    this.configService = new ConfigService();
  }

  getGuild() {
    const guildID = this.configService.System.guildID;
    return this.clientService.client.guilds.cache.get(guildID);
  }
}

module.exports = GuildService;
