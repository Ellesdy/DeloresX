const {
  ChannelJSON,
  CommandJSON,
  ReactionRoleJSON,
  RoleJSON,
  SystemJSON,
} = require('../../repository/config.repository');

  
class ConfigService {
  Channel = ChannelJSON;
  Command = CommandJSON;
  ReactionRole = ReactionRoleJSON;
  Role = RoleJSON;
  System = SystemJSON;

  constructor() {}

  GetAllConfigs = () => {
    return [
      ChannelJSON,
      CommandJSON,
      ReactionRoleJSON,
      RoleJSON,
      SystemJSON,
    ];
  };
}

  module.exports = ConfigService;