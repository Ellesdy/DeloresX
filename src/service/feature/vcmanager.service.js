const { PermissionsBitField, EmbedBuilder } = require('discord.js');

class VCManagerService {
  constructor() {}

  async create(interaction, name, limit) {
    // Create the channel
    const channel = await interaction.guild.channels.create(name, {
      type: 'GUILD_VOICE',
      userLimit: limit,
      permissionOverwrites: [
        {
          id: interaction.guild.roles.everyone.id,
          deny: PermissionsBitField.Flags.ViewChannel,
          type: 'role',
        },
        {
          id: interaction.user.id,
          allow: PermissionsBitField.Flags.Connect | PermissionsBitField.Flags.ViewChannel,
          type: 'member',
        },
      ],
    });
    return channel;
  }

  async limit(interaction, channel, limit){
    // Check if user has permission to change the user limit
    const permissions = channel.permissionsFor(interaction.user);
    if (!permissions.has(PermissionsBitField.Flags.ManageChannels)) {
      throw new Error('You do not have permission to change the user limit.');
    }

    // Update the user limit
    await channel.edit({ userLimit: limit });

    // Send confirmation message
    const embed = new EmbedBuilder()
      .setColor('#00ff00')
      .setDescription(`Successfully updated user limit to ${limit}!`)
    await interaction.reply({ embeds: [embed] });
  }

  async allow(interaction, channel, user) {
    // Check if the command issuer has permission to manage the channel
    const permissions = channel.permissionsFor(interaction.user);
    if (!permissions.has(PermissionsBitField.Flags.ManageChannels)) {
      throw new Error('You do not have permission to manage the channel.');
    }

    // Allow the specified user to join the channel
    await channel.permissionOverwrites.edit(user, {
      [PermissionsBitField.Flags.Connect]: true,
      [PermissionsBitField.Flags.ViewChannel]: true,
    });

    // Send confirmation message
    const embed = new EmbedBuilder()
      .setColor('#00ff00')
      .setDescription(`Successfully allowed ${user.tag} to join the channel.`);
    await interaction.reply({ embeds: [embed] });
  }

  async kick(interaction, channel, user) {
    // Check if the command issuer has permission to manage the channel
    const permissions = channel.permissionsFor(interaction.user);
    if (!permissions.has(PermissionsBitField.Flags.ManageChannels)) {
      throw new Error('You do not have permission to manage the channel.');
    }
  
    // Check if the specified user is in the channel
    if (user.voice.channelId !== channel.id) {
      throw new Error(`${user.tag} is not in the specified channel.`);
    }
  
    // Kick the specified user from the channel
    await user.voice.setChannel(null);
  
    // Send confirmation message
    const embed = new EmbedBuilder()
      .setColor('#00ff00')
      .setDescription(`Successfully kicked ${user.tag} from the channel.`);
    await interaction.reply({ embeds: [embed] });
  }


}

module.exports = VCManagerService;