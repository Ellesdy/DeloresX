const axios = require('axios');
const MockAdapter = require('axios-mock-adapter');
const ChatGPTService = require('../../../../src/service/library/chatgpt/chatgpt.service');
const ConversationService = require('../../../../src/service/helper/conversation.helper.service');
const fs = require('fs');

describe('ChatGPTService', () => {
  const mockAxios = new MockAdapter(axios);
  const conversationService = new ConversationService();
  const chatGPTService = new ChatGPTService(conversationService);

  let userId, content, expectedResponse, contentFromFile;

  beforeEach(() => {
    userId = '123456789';
    content = 'How are you?';
    expectedResponse = `I am an AI, so I don't have emotions, but I'm here to help you.`;
    contentFromFile = fs.readFileSync('./combined_output.txt', 'utf8');
  });

  afterEach(() => {
    mockAxios.reset();
  });

  test('handleMessage updates conversation and returns GPT response', async () => {
    jest.spyOn(chatGPTService, 'getResponse').mockResolvedValue('I am an AI, so I do not have emotions, but I am here to help you.');
    jest.spyOn(conversationService, 'updateConversation');
    jest.spyOn(conversationService, 'getConversation').mockResolvedValue([]);
  
    const response = await chatGPTService.handleMessage(userId, content);
  
    expect(chatGPTService.getResponse).toHaveBeenCalled();
    expect(conversationService.updateConversation).toHaveBeenCalledWith(userId, {
      role: 'user',
      content: expect.any(String),
    });
    expect(conversationService.updateConversation).toHaveBeenCalledWith(userId, {
      role: 'assistant',
      content: expect.any(String),
    });
    expect(response).toBeDefined();
  });
});