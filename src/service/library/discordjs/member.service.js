class MemberService {
    constructor(configService, clientService) {
      this.configService = configService;
      this.clientService = clientService;
    }
  
    getMemberFromUser(userID) {
      return this.clientService.client.guilds.cache.get(this.configService.System.guildID).members.cache.get(userID);
    }
  }
  
  module.exports = MemberService;