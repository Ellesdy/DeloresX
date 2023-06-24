const MemberService = require('../../../../src/service/library/discordjs/member.service');

describe('MemberService', () => {
    //test the getMemberFromUser function
    test('getMemberFromUser returns member', () => {
        //create a mock client
        const mockClientService = {
            client: {
                guilds: {
                    cache: {
                        get: jest.fn().mockReturnValue({
                            members: {
                                cache: {
                                    get: jest.fn().mockReturnValue('member')
                                }
                            }
                        })
                    }
                }
            }
        };
        //create a mock config
        const mockConfigService = {
            System: {
                guildID: '123456789'
            }
        };

        //create a mock member service
        const memberService = new MemberService(mockConfigService, mockClientService);
        //get the member from the user
        const member = memberService.getMemberFromUser('123456789');
        //expect the member to be returned
        expect(member).toBe('member');
    });
});