const { EmbedBuilder } = require('discord.js');
const EmbedService = require('../../../../src/service/library/discordjs/embed.service');

describe('EmbedService', () => {
  describe('createReactionRoleEmbed', () => {
    it('should create a message embed for a reaction role group', () => {
      const reactionRoleGroup = {
        name: 'Role Selection',
        message: 'React to this message to get a role',
        inline: true,
        members: [
          { roleName: 'Admin', emoji: '👑' },
          { roleName: 'Moderator', emoji: '🛡️' },
          { roleName: 'Subscriber', emoji: '👍' },
        ],
      };

      const expectedEmbed = new EmbedBuilder()
        .setTitle('Role Selection')
        .setDescription('React to this message to get a role')
        .setColor('#ff0000')
        .addFields(
          { name: 'Admin', value: '👑', inline: true },
          { name: 'Moderator', value: '🛡️', inline: true },
          { name: 'Subscriber', value: '👍', inline: true }
        );

      // Declare the result variable here
      const result = EmbedService.createReactionRoleEmbed(reactionRoleGroup);

      expect(result.title).toBe(expectedEmbed.title);
      expect(result.description).toBe(expectedEmbed.description);
      expect(result.fields).toEqual(expectedEmbed.fields);
      expect(result.color).toBe(expectedEmbed.color);
    });
  });
});
