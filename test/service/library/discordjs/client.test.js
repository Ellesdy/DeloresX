const { Client } = require('discord.js');
const ClientService = require('../../../../src/service/library/discordjs/client.service');

jest.mock('discord.js');

describe('ClientService', () => {
  let clientService;

  beforeEach(() => {
    clientService = new ClientService();
  });

  it('should create a new Discord.js client', async () => {
    const client = clientService.createClient();
    expect(client).toBeInstanceOf(Client);
  });

  it('should return the Discord.js client', async () => {
    const client = clientService.Client;
    expect(client).toBeInstanceOf(Client);
  });

  it('should log the bot in', async () => {
    const loginSpy = jest.spyOn(clientService.client, 'login').mockImplementation(() => {});
    await clientService.login();
    expect(loginSpy).toHaveBeenCalled();
  });
});