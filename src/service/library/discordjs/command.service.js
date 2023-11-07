const { REST, Routes } = require('discord.js');

class CommandService {
  constructor(
    configService,
    clientService,
    guildService,
    loggerService,
    validationHelperService,
    vcManagerService,
    verifyService
  ) {
    this.configService = configService;
    this.clientService = clientService;
    this.guildService = guildService;
    this.loggerService = loggerService;
    this.validationHelperService = validationHelperService;
    this.vcManagerService = vcManagerService;
    this.verifyService = verifyService;
    this.rest = new REST({ version: '10' }).setToken(this.clientService.getBotToken());
  }

  async registerCommands() {
    try {
      this.loggerService.logSystem('Started refreshing application (/) commands.');

      const commands = Object.values(this.configService.Command.commands);
      const clientId = this.clientService.Client.user.id;
      const guildId = this.guildService.getGuildId(); // Ensure getGuildId is implemented in GuildService

      await this.rest.put(
        Routes.applicationGuildCommands(clientId, guildId),
        { body: commands }
      );

      this.loggerService.logSuccess('Successfully reloaded application (/) commands.');
    } catch (error) {
      this.loggerService.logError('Error registering commands:', error);
    }
  }

  // Method to setup listeners for command interactions
  setupListeners() {
    this.clientService.Client.on('interactionCreate', async (interaction) => {
      if (!interaction.isCommand()) return;

      const { commandName } = interaction;
      // Implement command handling logic here
      // For example:
      // if (commandName === 'ping') {
      //   await interaction.reply('Pong!');
      // }
    });
  }
}

module.exports = CommandService;
