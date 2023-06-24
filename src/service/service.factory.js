const BroadcastService = require('./system/broadcast.service');
const LoggerService = require('./system/logger.service');
const ConfigService = require('./system/config.service');
const ClientService = require('./library/discordjs/client.service');
const GuildService = require('./library/discordjs/guild.service');
const CommandService = require('./library/discordjs/command.service');
const ChatGPTService = require('./library/chatgpt/chatgpt.service');
const LifecycleHelperService = require('./helper/lifecycle.helper.service');
const StartupService = require('./system/startup.service');
const ValidationHelperService = require('./helper/validation.helper.service');
const VCManagerService = require('./feature/vcmanager.service')
const VerifyService = require('./feature/verify.service')
const ConversationHelperService = require('./helper/conversation.helper.service');
const MemberService = require('./library/discordjs/member.service');

class ServiceFactory {
    static createServices() {
        const broadcastService = new BroadcastService();
        const loggerService = new LoggerService(broadcastService);
        const configService = new ConfigService(loggerService);
        const clientService = new ClientService();

        const guildService = new GuildService(clientService);
        const memberService = new MemberService(configService, clientService);
        const vcManagerService = new VCManagerService();
        const validationHelperService = new ValidationHelperService(loggerService, configService);
        const verifyService = new VerifyService(configService);
        const commandService = new CommandService(
            configService,
            clientService,
            guildService,
            broadcastService,
            loggerService,
            validationHelperService,
            vcManagerService,
            verifyService
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
            memberService
        };
    }
}

module.exports = ServiceFactory;