const BroadcastService = require('../../../src/service/system/broadcast.service');

describe('BroadcastService', () => {
  test('sendDiscordMessage() sends a message with a length of more than 2000', async () => {
    const testString = "Enlilnadinshumidaman"
    const messageService = new BroadcastService();
    const channel = {
      send: jest.fn(),
    };
    const content = testString.repeat(300);
    await messageService.sendDiscordMessage(channel, content); // Pass channel directly instead of { channel }
    expect(channel.send).toHaveBeenCalledTimes(3);
    expect(channel.send.mock.calls).toEqual([
      [testString.repeat(100)],
      [testString.repeat(100)],
      [testString.repeat(100)]
    ]);
  });
});