class ReactionRoleService {
    constructor(configService, loggerService, roleService, memberService) {
      this.configService = configService;
      this.loggerService = loggerService;
      this.roleService = roleService;
      this.memberService = memberService;
    }

    GetReactionRoleGroups() {
      return this.configService.ReactionRole.members;
    }

    IsRoleReaction(reaction) {
      return this.GetAllReactionRoles().find((reactionRole) => reactionRole.Emoji === reaction.emoji.toString());
    }

    GetReactionRole(reaction) {
      return this.GetAllReactionRoles().find((x) => x.Emoji === reaction.emoji.toString());
    }

    GetAllReactionRoles() {
      return this.GetReactionRoleGroups().map((group) => group.Members).flat();
    }

    SetupReactionRoleListeners() {
        this.clientService.client.on('messageReactionAdd', async (reaction, user) => {
        if (reaction.partial) await reaction.fetch();
        if (user.bot) return;

        if (reaction.emoji.name === '⭐') {
          await this.HandshakeTOS(user);
        } else {
          await this.ApplyReactionRoleChange(reaction, user);
        }
      });

      this.clientService.client.on('messageReactionRemove', async (reaction, user) => {
        if (reaction.partial) await reaction.fetch();
        if (user.bot) return;

        this.ApplyReactionRoleChange(reaction, user, true);
      });
    }

    HandshakeTOS(user) {
      const member = XenCord.Client.guilds.cache.get(this.configService.System.guildID)?.members.cache.get(user.id);
      member.roles.add(this.roleService.getRulesRole().id);
    }

    ApplyReactionRoleChange(reaction, user, remove = false) {
      const reactionRoleEmoji = this.IsRoleReaction(reaction);

      if (reactionRoleEmoji) {
        const member = this.memberService.GetMemberFromUser(user.id);
        const reactionRole = this.GetReactionRole(reaction);
        const memberRole = this.roleService.GetRoleByName(reactionRole.RoleName);
        if (reactionRole) {
          if (remove) {
            member.roles.remove(memberRole);
          } else {
            member.roles.add(memberRole);
          }
        }
      }
    }
}
module.exports = ReactionRoleService;

