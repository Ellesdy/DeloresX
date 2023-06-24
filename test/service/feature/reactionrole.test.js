const ReactionRoleService = require('../../../src/service/feature/reactionrole.service');
const { EventEmitter } = require('events');

describe('ReactionRoleService', () => {
  let reactionRoleService;
  let mockConfigService;
  let mockLoggerService;
  let mockRoleService;
  let mockMemberService;

  beforeEach(() => {
    // Create a mock config service
    mockConfigService = {
      ReactionRole: {
        members: [],
      },
      System: {
        guildID: '123456789',
      },
    };

    // Create a mock logger service
    mockLoggerService = {
      // Add any methods used from loggerService and their implementations
    };

    // Create a mock role service
    mockRoleService = {
      GetRoleByName: jest.fn(),
      ValidateRole: jest.fn(),
      // Add any other methods used from roleService and their implementations
    };

    // Create a mock member service
    mockMemberService = {
      GetMemberFromUser: jest.fn(),
      // Add any other methods used from memberService and their implementations
    };

    // Create an instance of ReactionRoleService
    reactionRoleService = new ReactionRoleService(
      mockConfigService,
      mockLoggerService,
      mockRoleService,
      mockMemberService,
    );
  });

  test('GetReactionRoleGroups returns the correct data', () => {
    const reactionRoleGroups = reactionRoleService.GetReactionRoleGroups();
    expect(reactionRoleGroups).toEqual(mockConfigService.ReactionRole.members);
  });

  test('IsRoleReaction returns the correct reaction role', () => {
    const exampleReaction = {
      emoji: {
        toString: () => 'exampleEmoji',
      },
    };

    mockConfigService.ReactionRole.members = [
      { Members: [{ Emoji: 'exampleEmoji' }] },
    ];

    const reactionRole = reactionRoleService.IsRoleReaction(exampleReaction);
    expect(reactionRole).toEqual({ Emoji: 'exampleEmoji' });
  });

  test('GetReactionRole returns the correct reaction role', () => {
    const exampleReaction = {
      emoji: {
        toString: () => 'exampleEmoji',
      },
    };

    mockConfigService.ReactionRole.members = [
      { Members: [{ Emoji: 'exampleEmoji' }] },
    ];

    const reactionRole = reactionRoleService.GetReactionRole(exampleReaction);
    expect(reactionRole).toEqual({ Emoji: 'exampleEmoji' });
  });

  test('GetAllReactionRoles returns the correct flattened array', () => {
    mockConfigService.ReactionRole.members = [
      { Members: [{ Emoji: 'emoji1' }] },
      { Members: [{ Emoji: 'emoji2' }, { Emoji: 'emoji3' }] },
    ];

    const allReactionRoles = reactionRoleService.GetAllReactionRoles();
    expect(allReactionRoles).toEqual([
      { Emoji: 'emoji1' },
      { Emoji: 'emoji2' },
      { Emoji: 'emoji3' },
    ]);
  });
});