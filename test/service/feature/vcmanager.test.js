const VCManagerService = require('../../../src/service/feature/vcmanager.service');
const { PermissionsBitField, EmbedBuilder } = require('discord.js');

describe('VCManagerService', () => {
  let vcManagerService;
  let mockInteraction;
  let mockChannel;
  let mockUser;
  let permissions;

  beforeEach(() => {
    mockInteraction = {
      user: { id: 'user-id' },
      reply: jest.fn().mockResolvedValue(undefined),
    };

    permissions = {
      has: jest.fn().mockReturnValue(true),
    };

    mockChannel = {
      permissionsFor: jest.fn().mockReturnValue(permissions),
    };

    mockUser = {
      id: 'user-id',
      tag: 'User#1234',
    };

    vcManagerService = new VCManagerService();
  });

  const setChannelPermissions = (hasPermission) => {
    permissions.has.mockReturnValue(hasPermission);
  };

  const setUserVoice = (voice) => {
    mockUser.voice = voice;
  };
  
describe('create', () => {
  it('should create a new voice channel with the specified properties', async () => {
    // Mock interaction data
    const mockInteraction = {
        guild: {
        channels: {
            create: jest.fn().mockResolvedValue({ id: 'created-channel-id' }),
        },
        roles: {
            everyone: { id: 'everyone-role-id' },
        },
    },
        user: { id: 'user-id' },
        channel: {
        toString: jest.fn().mockReturnValue('#created-channel-name'),
        },
    }

    // Arrange
    const expectedOptions = {
      type: 'GUILD_VOICE',
      userLimit: 5,
      permissionOverwrites: [
        {
          id: 'everyone-role-id',
          deny: PermissionsBitField.Flags.ViewChannel,
          type: 'role',
        },
        {
          id: 'user-id',
          allow: PermissionsBitField.Flags.Connect | PermissionsBitField.Flags.ViewChannel,
          type: 'member',
        },
      ],
    };
    const expectedEmbed = {
      description: 'Created voice channel #created-channel-name',
      color: 65280,
    };
    const vcManagerService = new VCManagerService();

    // Act
    const result = await vcManagerService.create(mockInteraction, 'test-channel', 5);

    // Assert
    expect(mockInteraction.guild.channels.create).toHaveBeenCalledWith('test-channel', expectedOptions);
    expect(result).toStrictEqual( {"id": "created-channel-id"} )
  });

  it('should throw an error if the channel creation fails', async () => {
    // Arrange
    const mockInteraction = {
      guild: {
        channels: {
          create: jest.fn().mockRejectedValue(new Error('Error creating channel.')),
        },
        roles: {
            everyone: { id: 'everyone-role-id' },
          },
        },
          user: { id: 'user-id' },
          channel: {
            toString: jest.fn().mockReturnValue('#created-channel-name'),
          }
      }
    const vcManagerService = new VCManagerService();

    // Act and Assert
    await expect(vcManagerService.create(mockInteraction, 'test-channel', 5)).rejects.toThrow(new Error('Error creating channel.'));
  });
});

describe('limit', () => {
    it('should throw an error if the user does not have permission to change the user limit', async () => {
        setChannelPermissions(false);
        await expect(vcManagerService.limit(mockInteraction, mockChannel, 5)).rejects.toThrow(new Error('You do not have permission to change the user limit.'));
      });
      
    it('should update the user limit and send a confirmation message if the user has permission', async () => {
        // Mock interaction data
        const mockInteraction = {
          user: { id: 'user-id' },
          reply: jest.fn().mockResolvedValue(undefined),
        };
        const permissions = {
          has: jest.fn().mockReturnValue(true),
        };
        const mockChannel = {
          permissionsFor: jest.fn().mockReturnValue(permissions),
          edit: jest.fn().mockResolvedValue(undefined),
        };
        const vcManagerService = new VCManagerService();
      
        // Arrange
        const expectedEmbed = new EmbedBuilder({
          description: 'Successfully updated user limit to 10!',
          color: 65280,
        });
      
        // Act
        await vcManagerService.limit(mockInteraction, mockChannel, 10);
      
        // Assert
        expect(mockChannel.edit).toHaveBeenCalledWith({ userLimit: 10 });
        expect(mockInteraction.reply).toHaveBeenCalledWith({ embeds: [expectedEmbed] });
      });
  });

  describe('allow', () => {
    it('should allow the specified user to join the channel and send a confirmation message if the command issuer has permission', async () => {
      // Mock interaction data
      const mockInteraction = {
        user: { id: 'issuer-id' },
        reply: jest.fn().mockResolvedValue(undefined),
      };
      const permissions = {
        has: jest.fn().mockReturnValue(true),
      };
      const mockChannel = {
        permissionsFor: jest.fn().mockReturnValue(permissions),
        permissionOverwrites: { edit: jest.fn().mockResolvedValue(undefined) },
      };
      const mockUser = { id: 'user-id', tag: 'User#1234' };
      const vcManagerService = new VCManagerService();
  
      // Arrange
      const expectedEmbed = new EmbedBuilder()
        .setColor('#00ff00')
        .setDescription('Successfully allowed User#1234 to join the channel.');
  
      // Act
      await vcManagerService.allow(mockInteraction, mockChannel, mockUser);
  
      // Assert
      expect(mockChannel.permissionOverwrites.edit).toHaveBeenCalledWith(mockUser, {
        [PermissionsBitField.Flags.Connect]: true,
        [PermissionsBitField.Flags.ViewChannel]: true,
      });
      expect(mockInteraction.reply).toHaveBeenCalledWith({ embeds: [expectedEmbed] });
    });
  
    it('should throw an error if the command issuer does not have permission to manage the channel', async () => {
        setChannelPermissions(false);
        await expect(vcManagerService.allow(mockInteraction, mockChannel, mockUser)).rejects.toThrow(new Error('You do not have permission to manage the channel.'));
      });
  });

  describe('kick', () => {
    it('should kick the specified user from the channel and send a confirmation message if the command issuer has permission and user is in the channel', async () => {
        setUserVoice({
          channelId: 'channel-id',
          setChannel: jest.fn().mockResolvedValue(undefined),
        });
      
        // Add the mockChannel's id to match the channelId of the user's voice
        mockChannel.id = 'channel-id';
      
        // Define the expected embed
        const expectedEmbed = new EmbedBuilder()
          .setColor('#00ff00')
          .setDescription('Successfully kicked User#1234 from the channel.');
      
        await vcManagerService.kick(mockInteraction, mockChannel, mockUser);
      
        // Assert
        expect(mockUser.voice.setChannel).toHaveBeenCalledWith(null);
        expect(mockInteraction.reply).toHaveBeenCalledWith({ embeds: [expectedEmbed] });
      });
  
    it('should throw an error if the command issuer does not have permission to manage the channel', async () => {
        setChannelPermissions(false);
        setUserVoice({
          channelId: 'different-channel-id',
        });
  
        await expect(vcManagerService.kick(mockInteraction, mockChannel, mockUser)).rejects.toThrow(new Error('You do not have permission to manage the channel.'));
      });
    });
  });