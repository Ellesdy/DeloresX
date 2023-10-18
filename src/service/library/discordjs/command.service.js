const { MessageEmbed } = require('discord.js');

class CommandService {
  constructor(
    configService,
    clientService,
    guildService,
    messageService,
    loggerService,
    validationHelperService,
    vcManagerService,
    verifyService,
    voiceCommandService // Add the VoiceCommandService as a dependency
  ) {
    this.configService = configService;
    this.clientService = clientService;
    this.guildService = guildService;
    this.messageService = messageService;
    this.loggerService = loggerService;
    this.validationHelperService = validationHelperService;
    this.vcManagerService = vcManagerService;
    this.verifyService = verifyService;
    this.voiceCommandService = voiceCommandService; // Store the VoiceCommandService
  }

  async registerCommands() {
    try {
      const guild = await this.guildService.getGuild();
      this.validationHelperService.validateConfig(this.configService.Command.commands);

      this.loggerService.logSystem(
        `${this.messageService.Messages.command.register.prefix} ${this.messageService.Messages.command.register.start}`
      );

      for (const [commandName, commandData] of Object.entries(this.configService.Command.commands)) {
        await guild.commands.create(commandData);
        this.loggerService.logSuccess(`Registered command: ${commandName}`);
      }

      this.loggerService.logSuccess(
        `${this.messageService.Messages.command.register.prefix} ${this.messageService.Messages.command.register.success}`
      );
    } catch (error) {
      this.loggerService.logError(error.message, error);
    }
  }

  setupListeners() {
    this.clientService.Client.on('interactionCreate', async (interaction) => {
      if (interaction.isCommand()) {
        await this.bind(interaction);
      }
    });
  }

  async bind(interaction) {
    const { commandName, options } = interaction;

    if (commandName === 'channel') {
      const subcommand = options.getSubcommand();
      const subcommands = {
        create: this.vcManagerService.create.bind(this.vcManagerService),
        limit: this.vcManagerService.limit.bind(this.vcManagerService),
        allow: this.vcManagerService.allow.bind(this.vcManagerService),
        kick: this.vcManagerService.kick.bind(this.vcManagerService),
      };

      if (subcommands[subcommand]) {
        await subcommands[subcommand](interaction);
      } else {
        await interaction.reply('Unknown subcommand.');
      }
    } else if (commandName === 'verify') {
      await this.verifyService.verify(interaction, {
        unverifiedRoleID: this.configService.getConfigValue('Client.unverifiedRoleID'),
        verifiedRoleID: this.configService.getConfigValue('Client.verifiedRoleID')
      });
    } else if (commandName === 'join') {
      await this.handleJoinCommand(interaction);
    }
  }

  async handleJoinCommand(interaction) {
    // Check if the user is in a voice channel
    const voiceChannel = interaction.member.voice.channel;
    if (!voiceChannel) {
      await interaction.reply('You need to be in a voice channel for me to join!');
      return;
    }

    // Instruct the VoiceCommandService to join the voice channel
    await this.voiceCommandService.joinChannel(voiceChannel);

    // Send a confirmation message
    const embed = new MessageEmbed()
      .setColor('#00ff00')
      .setDescription(`Successfully joined ${voiceChannel.name}!`);
    await interaction.reply({ embeds: [embed] });
  }
}

module.exports = CommandService;
