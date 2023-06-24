const ChannelService = require('../../../../src/service/library/discordjs/channel.service');

describe('ChannelService', () => {
  let channelService;
  let loggerMock;
  let clientMock;
  let channelMock;

  beforeEach(() => {
    channelService = new ChannelService();

    // mock Logger and Client objects
    loggerMock = { Log: { System: jest.fn(), Success: jest.fn(), Error: jest.fn() } };
    clientMock = { channels: { cache: { get: jest.fn() } } };

    // set up ChannelService with mocked objects
    channelService.Logger = loggerMock;
    channelService.Client = clientMock;
    channelService.Message = {
      Messages: {
        system: { startup: { channel: { start: 'starting', success: 'success', done: 'done' } } },
        error: { startup: { channel: 'error' } },
      },
    };
    channelService.Config = {
      Channel: {
        Name: 'Test',
        Channel1: '123',
        Channel2: '456',
      },
    };

    // mock getChannel method to return a mock channel
    channelMock = { name: 'testChannel' };
    clientMock.channels.cache.get.mockReturnValue(channelMock);
  });

  describe('Validate', () => {
    it('should log startup messages for each system channel', () => {
      // call Validate method and expect correct log messages
      channelService.Validate();
      expect(loggerMock.Log.System).toHaveBeenCalledWith('starting');
      expect(loggerMock.Log.Success).toHaveBeenCalledWith('successChannel1 [testChannel]');
      expect(loggerMock.Log.Success).toHaveBeenCalledWith('successChannel2 [testChannel]');
      expect(loggerMock.Log.Error).not.toHaveBeenCalled();
      expect(loggerMock.Log.System).toHaveBeenCalledWith('done');
    });
  });

  describe('GetSystemChannel', () => {
    it('should return the correct system channel by index', () => {
      // call GetSystemChannel method and expect correct channel to be returned
      const channel = channelService.GetSystemChannel('Channel1');
      expect(channel).toBe(channelMock);
      expect(clientMock.channels.cache.get).toHaveBeenCalledWith('123');
    });
  });

  describe('GetSystemChannels', () => {
    it('should return an array of system channels with their indexes', () => {
      // call GetSystemChannels method and expect correct array to be returned
      const channels = channelService.GetSystemChannels();
      expect(channels).toEqual([['Channel1', '123'], ['Channel2', '456']]);
    });
  });
});