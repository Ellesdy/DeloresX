const ServiceFactory = require('../../src/service/service.factory');
const BroadcastService = require('../../src/service/system/broadcast.service');
const LoggerService = require('../../src/service/system/logger.service');
const ConfigService = require('../../src/service/system/config.service');
const ClientService = require('../../src/service/library/discordjs/client.service');
const GuildService = require('../../src/service/library/discordjs/guild.service');
const CommandService = require('../../src/service/library/discordjs/command.service');
const ChatGPTService = require('../../src/service/library/chatgpt/chatgpt.service');
const LifecycleHelperService = require('../../src/service/helper/lifecycle.helper.service');
const StartupService = require('../../src/service/system/startup.service');
const ValidationHelperService = require('../../src/service/helper/validation.helper.service');
const VCManagerService = require('../../src/service/feature/vcmanager.service');
const VerifyService = require('../../src/service/feature/verify.service');
const ConversationHelperService = require('../../src/service/helper/conversation.helper.service');
const MemberService = require('../../src/service/library/discordjs/member.service');

describe('ServiceFactory', () => {
  test('createServices should create instances of all services', () => {
    const services = ServiceFactory.createServices();

    expect(services).toHaveProperty('clientService');
    expect(services.clientService).toBeInstanceOf(ClientService);

    expect(services).toHaveProperty('guildService');
    expect(services.guildService).toBeInstanceOf(GuildService);

    expect(services).toHaveProperty('commandService');
    expect(services.commandService).toBeInstanceOf(CommandService);

    expect(services).toHaveProperty('chatGPTService');
    expect(services.chatGPTService).toBeInstanceOf(ChatGPTService);

    expect(services).toHaveProperty('lifecycleHelperService');
    expect(services.lifecycleHelperService).toBeInstanceOf(LifecycleHelperService);

    expect(services).toHaveProperty('startupService');
    expect(services.startupService).toBeInstanceOf(StartupService);

    expect(services).toHaveProperty('broadcastService');
    expect(services.broadcastService).toBeInstanceOf(BroadcastService);

    expect(services).toHaveProperty('loggerService');
    expect(services.loggerService).toBeInstanceOf(LoggerService);

    expect(services).toHaveProperty('configService');
    expect(services.configService).toBeInstanceOf(ConfigService);

    expect(services).toHaveProperty('vcManagerService');
    expect(services.vcManagerService).toBeInstanceOf(VCManagerService);

    expect(services).toHaveProperty('validationHelperService');
    expect(services.validationHelperService).toBeInstanceOf(ValidationHelperService);

    expect(services).toHaveProperty('verifyService');
    expect(services.verifyService).toBeInstanceOf(VerifyService);

    expect(services).toHaveProperty('memberService');
    expect(services.memberService).toBeInstanceOf(MemberService);
  });
});