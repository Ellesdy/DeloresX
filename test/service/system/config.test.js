const {
    ChannelJSON,
    CommandJSON,
    ReactionRoleJSON,
    RoleJSON,
    SystemJSON,
  } = require('../../../src/repository/config.repository');
  
  const ConfigService = require('../../../src/service/system/config.service');
  
  describe('ConfigService', () => {
    let configService;
  
    beforeEach(() => {
      configService = new ConfigService();
    });
  
    describe('constructor', () => {
      it('should initialize the Channel property with the ChannelJSON object', () => {
        expect(configService.Channel).toEqual(ChannelJSON);
      });
  
      it('should initialize the Command property with the CommandJSON object', () => {
        expect(configService.Command).toEqual(CommandJSON);
      });
  
      it('should initialize the ReactionRole property with the ReactionRoleJSON object', () => {
        expect(configService.ReactionRole).toEqual(ReactionRoleJSON);
      });
  
      it('should initialize the Role property with the RoleJSON object', () => {
        expect(configService.Role).toEqual(RoleJSON);
      });
  
      it('should initialize the System property with the SystemJSON object', () => {
        expect(configService.System).toEqual(SystemJSON);
      });
    });
  
    describe('GetAllConfigs', () => {
      it('should return an array of all configuration objects', () => {
        const allConfigs = configService.GetAllConfigs();
        expect(allConfigs).toContain(ChannelJSON);
        expect(allConfigs).toContain(CommandJSON);
        expect(allConfigs).toContain(ReactionRoleJSON);
        expect(allConfigs).toContain(RoleJSON);
        expect(allConfigs).toContain(SystemJSON);
      });
    });
  });