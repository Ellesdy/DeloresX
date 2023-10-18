class VerifyService {
  constructor(configService) {
    this.configService = configService;
  }

  async verify(interaction) {
    // Check if the sender has the required roles
    const hasVerifyRole = interaction.member.roles.cache.has(this.configService.Role.Verify);
    const hasAdministratorRole = interaction.member.roles.cache.has(process.env.VERIFY_ROLE_ID);
  
    if (!hasVerifyRole) {
      return interaction.reply({ content: 'You do not have permission to use this command.', ephemeral: true });
    }

    const userToVerify = interaction.options.getUser('user');

    if (!userToVerify) {
      return interaction.reply({ content: 'Please mention a user to verify.', ephemeral: true });
    }

    const memberToVerify = await interaction.guild.members.fetch(userToVerify);

    if (!this.isValidMember(memberToVerify)) {
      return interaction.reply({ content: 'Unable to verify the user.', ephemeral: true });
    }

    await this.updateRoles(memberToVerify);
    interaction.reply({ content: `${memberToVerify.user.username} has been verified!`, ephemeral: true });
  }

  hasVerifyRole(interaction) {
    return interaction.member.roles.cache.has(this.configService.Role.Verify);
  }

  isValidMember(member) {
    return member && member.user;
  }

  async updateRoles(member) {
    await member.roles.remove(this.configService.Role.Unverified);
    await member.roles.add(this.configService.Role.Verified);
  }
}

module.exports = VerifyService;