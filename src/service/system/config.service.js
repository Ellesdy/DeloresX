// Importing configuration data from the config repository
const {
  ChannelJSON,
  CommandJSON,
  ReactionRoleJSON,
  RoleJSON,
  SystemJSON,
  ClientJSON
} = require('../../repository/config.repository');

// The ConfigService class centralizes access to various configurations
class ConfigService {
  // Assigning the imported JSON objects to class properties
  Channel = ChannelJSON;
  Command = CommandJSON;
  ReactionRole = ReactionRoleJSON;
  Role = RoleJSON;
  System = SystemJSON;
  Client = ClientJSON;

  // Constructor for the ConfigService class
  constructor() {}

  // Method to retrieve all configuration objects
  GetAllConfigs = () => {
    return [
      this.Channel,
      this.Command,
      this.ReactionRole,
      this.Role,
      this.System,
      this.Client
    ];
  };

  // Method to get a specific configuration value by key
  getConfigValue = (key) => {
    // Split the key by dots to handle nested keys
    const keys = key.split('.');
    let result = this;

    // Traverse the configuration object to get to the nested property
    for (const k of keys) {
      result = result[k];
      if (result === undefined) {
        // If at any point the key is not found, throw an error
        throw new Error(`Config key ${key} not found`);
      }
    }
    return result;
  };
}

// Exporting the ConfigService class to be used in other parts of the application
module.exports = ConfigService;
