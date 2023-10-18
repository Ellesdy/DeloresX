const {
  ChannelJSON,
  CommandJSON,
  ReactionRoleJSON,
  RoleJSON,
  SystemJSON,
  ClientJSON, // Import the ClientJSON configuration
} = require('../../repository/config.repository');

class ConfigService {
  constructor() {
    this.Client = ClientJSON;
    this.Channel = ChannelJSON;
    this.Command = CommandJSON;
    this.ReactionRole = ReactionRoleJSON;
    this.Role = RoleJSON;
    this.System = SystemJSON;
  }

  getConfigValue(key) {
    console.log("Key requested:", key); // For debugging  
    switch (key) {
      case 'Channel':
        return this.Channel;
      case 'Command':
        return this.Command;
      case 'ReactionRole':
        return this.ReactionRole;
      case 'Role':
        return this.Role;
      case 'System':
        return this.System;
      case 'Client': // Add this case
        return this.Client;
      default:
        // Handle nested properties
        const keys = key.split('.');
        if (keys.length > 1 && this[keys[0]]) {
          return this[keys[0]][keys[1]];
        }
        throw new Error(`Unknown config key: ${key}`);
    }
  }

  GetAllConfigs() {
    return [
      this.Channel,
      this.Command,
      this.ReactionRole,
      this.Role,
      this.System,
      this.Client // Add this line
    ];
  }

  getBotToken() {
    return this.Client.botToken; // Fetch the bot token from the Client configuration
  }
}

module.exports = ConfigService;
