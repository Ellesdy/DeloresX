const VerifyService = require('../../../src/service/feature/verify.service');

describe('VerifyService', () => {
  let verifyService;
  let interactionMock;

  beforeEach(() => {
    interactionMock = {
      member: {
        roles: {
          cache: {
            has: jest.fn().mockReturnValue(true),
          },
        },
      },
      options: {
        getUser: jest.fn().mockReturnValue({ id: '123' }),
      },
      guild: {
        members: {
          fetch: jest.fn().mockResolvedValue({ user: { username: 'Test User' }, roles: { add: jest.fn(), remove: jest.fn() } }),
        },
      },
      reply: jest.fn(),
    };

    const config = {
      Role: {
        Verify: '123',
        Unverified: '456',
        Verified: '789',
      },
    };

    const configService = {
      getAllConfigs: jest.fn().mockReturnValue([config]),
      Role: config.Role,
    };

    verifyService = new VerifyService(configService);
  });

  const setSenderRole = (hasRole) => {
    interactionMock.member.roles.cache.has.mockReturnValue(hasRole);
  };

  const setUserToVerify = (user) => {
    interactionMock.options.getUser.mockReturnValue(user);
  };

  const setGuildMember = (member) => {
    interactionMock.guild.members.fetch.mockResolvedValue(member);
  };

  it('should verify the user if the sender has the Verify role and a user is mentioned', async () => {
    await verifyService.verify(interactionMock);

    const guildMember = await interactionMock.guild.members.fetch();
    expect(interactionMock.member.roles.cache.has).toHaveBeenCalledWith('123');
    expect(interactionMock.options.getUser).toHaveBeenCalledWith('user');
    expect(guildMember.roles.remove).toHaveBeenCalledWith('456');
    expect(guildMember.roles.add).toHaveBeenCalledWith('789');
    expect(interactionMock.reply).toHaveBeenCalledWith({ content: 'Test User has been verified!', ephemeral: true });
  });

  it('should not verify the user if the sender does not have the Verify role', async () => {
    setSenderRole(false);
    await verifyService.verify(interactionMock);

    expect(interactionMock.reply).toHaveBeenCalledWith({ content: 'You do not have permission to use this command.', ephemeral: true });
  });

  it('should not verify the user if no user is mentioned', async () => {
    setUserToVerify(null);
    await verifyService.verify(interactionMock);

    expect(interactionMock.reply).toHaveBeenCalledWith({ content: 'Please mention a user to verify.', ephemeral: true });
  });

  it('should not verify the user if the GuildMember object is invalid', async () => {
    setGuildMember(null);
    await verifyService.verify(interactionMock);

    expect(interactionMock.reply).toHaveBeenCalledWith({ content: 'Unable to verify the user.', ephemeral: true });
  });
});