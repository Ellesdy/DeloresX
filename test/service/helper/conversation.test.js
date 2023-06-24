const ConversationHelperService = require('../../../src/service/helper/conversation.helper.service');
const ConversationCacheModel = require('../../../src/model/conversationcache.model');

jest.mock('../../../src/model/conversationcache.model');

describe('ConversationHelperService', () => {
  let conversationHelperService;
  let conversationCacheMock;
  const userId = '123';

  beforeEach(() => {
    conversationCacheMock = {
      get: jest.fn(),
      set: jest.fn(),
    };
    ConversationCacheModel.mockImplementation(() => conversationCacheMock);
    conversationHelperService = new ConversationHelperService();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  const createMessage = (content) => ({
    content: content,
    timestamp: Date.now(),
  });

  describe('getConversation', () => {
    it('should call conversationCache.get with the provided userId', () => {
      conversationHelperService.getConversation(userId);
      expect(conversationCacheMock.get).toHaveBeenCalledWith(userId);
    });
  });

  describe('updateConversation', () => {
    it('should add the messageObj to the conversation cache for the provided userId', async () => {
      const messageObj = createMessage('Hello, world!');
      conversationCacheMock.get.mockReturnValue([]);
      await conversationHelperService.updateConversation(userId, messageObj);
      expect(conversationCacheMock.get).toHaveBeenCalledWith(userId);
      expect(conversationCacheMock.set).toHaveBeenCalledWith(userId, [messageObj]);
    });

    it('should remove the oldest message if the conversation cache exceeds 9 messages', async () => {
      const messages = [
        createMessage('Hello, world!'),
        createMessage('How are you?'),
        createMessage('I am doing well, thanks.'),
        createMessage('What about you?'),
        createMessage('I am good too, thanks!'),
        createMessage('Have a nice day!'),
        createMessage('You too!'),
        createMessage('Goodbye!'),
        createMessage('See you later!'),
      ];
      const newMessage = createMessage('Bye!');
      conversationCacheMock.get.mockReturnValue([...messages]);
      await conversationHelperService.updateConversation(userId, newMessage);
      expect(conversationCacheMock.get).toHaveBeenCalledWith(userId);
      expect(conversationCacheMock.set).toHaveBeenCalledWith(userId, [
        ...messages.slice(1),
        newMessage,
      ]);
    });
  });
});