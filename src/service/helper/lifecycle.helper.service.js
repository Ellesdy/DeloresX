class LifecycleHelperService {
  constructor(clientService, commandService, conversationService, chatGPTService, messageService, channelService, sendTyping) {
    this.clientService = clientService;
    this.commandService = commandService;
    this.conversationService = conversationService;
    this.chatGPTService = chatGPTService;
    this.messageService = messageService;
    this.channelService = channelService;
  }

  async setupListeners() {
    await this.clientService.client.on('ready', async () => {
      console.log(`Logged in as ${this.clientService.client.user.tag}!`);
      await this.commandService.setupListeners();
      await this.commandService.registerCommands();
    });

    this.clientService.client.on('messageCreate', async (message) => {
      if (message.author.bot) return;
      if (message.mentions.has(this.clientService.client.user)) {
        const typing = message.channel.sendTyping();
        const userId = message.author.id;
        const content = message.content;
        const response = await this.chatGPTService.handleMessage(userId, content);
    
        if (response.length === 0) {
          return;
        }
    
        if (typeof response === 'string') {
          await this.messageService.sendDiscordMessage(message.channel, response);
        } else {
          let combinedResponse = '';
    
          for (let i = 0; i < response.length; i++) {
            const messageContent = response[i].content.trim();
    
            if (messageContent !== '') {
              const responseText = combinedResponse + messageContent;
    
              if (responseText.length <= 2000) {
                combinedResponse = responseText;
              } else {
                await this.messageService.sendDiscordMessage(message.channel, combinedResponse);
                combinedResponse = messageContent;
              }
            }
            if (i === response.length - 1) {
              await this.messageService.sendDiscordMessage(message.channel, combinedResponse);
              typing.stop();            
            }
          }
        }
      }
    });
  }
}

module.exports = LifecycleHelperService;
