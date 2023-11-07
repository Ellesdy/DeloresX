const BroadcastService = require('./system/broadcast.service');
const LoggerService = require('./system/logger.service');
const ConfigService = require('./system/config.service');
// Ensure that ClientService is correctly required from its path
const ClientService = require('./library/discordjs/client.service');
const GuildService = require('./library/discordjs/guild.service');
const CommandService = require('./library/discordjs/command.service');
// Ensure that ChatGPTService is correctly required from its path
const ChatGPTService = require('./library/chatgpt/chatgpt.service');
const LifecycleHelperService = require('./helper/lifecycle.helper.service');
const StartupService = require('./system/startup.service');
const ValidationHelperService = require('./helper/validation.helper.service');
const VCManagerService = require('./feature/vcmanager.service');
const VerifyService = require('./feature/verify.service');
const ConversationHelperService = require('./helper/conversation.helper.service');
const MemberService = require('./library/discordjs/member.service');
// Ensure that VoiceCommandService is correctly required from its path
const VoiceCommandService = require('./feature/voicecommand.service');

class ServiceFactory {
  // Debugging statements
  static debug() {
    console.log('Inside ServiceFactory class definition.');
  }

  static createServices() {
    // Instantiate each service with the required dependencies
    const broadcastService = new BroadcastService();
    const configService = new ConfigService();
    const validationHelperService = new ValidationHelperService(configService);
    const loggerService = new LoggerService(broadcastService);
    const clientService = new ClientService();
    const guildService = new GuildService(clientService, configService);
    const memberService = new MemberService(configService, clientService);
    const vcManagerService = new VCManagerService();
    const verifyService = new VerifyService(configService);
    const voiceCommandService = new VoiceCommandService();
    const commandService = new CommandService(
      configService,
      clientService,
      guildService,
      loggerService,
      validationHelperService,
      vcManagerService,
      verifyService,
      voiceCommandService
    );
    const conversationService = new ConversationHelperService();
    const chatGPTService = new ChatGPTService(conversationService);
    const lifecycleHelperService = new LifecycleHelperService(
      clientService,
      commandService,
      conversationService,
      chatGPTService,
      broadcastService
    );
    const startupService = new StartupService(clientService, lifecycleHelperService, validationHelperService, commandService);

    // Return an object containing all instantiated services
    return {
      clientService,
      guildService,
      commandService,
      chatGPTService,
      lifecycleHelperService,
      startupService,
      broadcastService,
      loggerService,
      configService,
      vcManagerService,
      validationHelperService,
      verifyService,
      memberService,
      voiceCommandService
    };
  }
}

module.exports = ServiceFactory;
