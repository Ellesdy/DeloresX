const axios = require("axios");
const fs = require('fs');
const ConfigService = require('../../system/config.service'); // Adjust the path as necessary

const contentFromFile = fs.readFileSync('./system.txt', 'utf8');

class ChatGPTService {
  constructor(conversationService) {
    this.conversationService = conversationService;
    this.configService = new ConfigService(); // Instantiate ConfigService
    this.apiKey = this.configService.System.openAIKey; // Retrieve the OpenAI API key from the System configuration
  }

  async getResponse(conversation, userId) {
    const headers = {
      "Content-Type": "application/json",
      Authorization: `Bearer ${this.apiKey}`,
    };

    const messages = [
      {
        role: "system",
        content: contentFromFile,
      },
      ...conversation.map((message) => ({
        role: message.role,
        content: message.content ? message.content.replace(/<@!?(\d+)>/g, '') : '' // Remove mentions from the content
      }))
    ];
  
    const data = {
      model: "gpt-4",
      messages: messages,
      max_tokens: 1024,
      temperature: 0.7,
    };
  
    try {
      const response = await axios.post(
          "https://api.openai.com/v1/chat/completions",
          data,
          { headers: headers }
      );
  
      const gptResponse = response.data.choices[0].message.content.trim();
      this.conversationService.updateConversation(userId, {
        role: "assistant",
        content: gptResponse,
      });
      return gptResponse;
      
    } catch (error) {
      console.error("Error getting ChatGPT response:", error);
      return "I'm sorry, but I couldn't process your message.";
    }
  }

  async handleMessage(userId, content) {
    await this.conversationService.updateConversation(userId, {
      role: 'user',
      content: content,
    });

    const conversation = await this.conversationService.getConversation(userId) || [];
    const response = await this.getResponse(conversation, userId);

    await this.conversationService.updateConversation(userId, {
        role: 'assistant',
        content: response,
    });
    return response;
  }
}

module.exports = ChatGPTService;
