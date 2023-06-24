class GuildService {
  constructor(clientService) {
    this.clientService = clientService;
  }

  getGuild() {
    return this.clientService.client.guilds.cache.get(process.env.GUILD_ID);
  }
}

module.exports = GuildService;