// client.test.js
const { Client } = require('discord.js');
const ClientService = require('../../../../src/service/library/discordjs/client.service');

jest.mock('discord.js', () => {
  return {
    Client: jest.fn().mockImplementation(() => {
      return {
        login: jest.fn()
      };
    })
  };
});

describe('ClientService', () => {
  let clientService;

  beforeEach(() => {
    clientService = new ClientService();
  });

  it('should create a new Discord.js client', () => {
    expect(clientService.client).toBeInstanceOf(Client);
  });

  it('should log the bot in', async () => {
    const token = 'mocked_token';
    clientService.client.login.mockResolvedValue(token);
    await clientService.login(token);
    expect(clientService.client.login).toHaveBeenCalledWith(token);
  });
});
