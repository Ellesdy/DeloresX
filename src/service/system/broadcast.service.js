const MessageJSON = require('../../config/message.config.json');

class BroadcastService {
  constructor() {
    this.Messages = MessageJSON;
  }

  async sendDiscordMessage(channel, content) {
    const maxLength = 2000;
  
    if (content.length <= maxLength) {
      await channel.send(content);
    } else {
      const messageParts = [];
      let message = content;
  
      while (message.length > 0) {
        if (message.length <= maxLength) {
          messageParts.push(message);
          message = '';
        } else {
          let subMessage = message.substring(0, maxLength);
  
          // Look for whitespace within last 10 characters
          const index = subMessage.lastIndexOf(' ');
          if (index >= subMessage.length - 10 && index !== -1) {
            subMessage = subMessage.substring(0, index);
          }
  
          // Strip the last character if it is a whitespace
          if (subMessage.charAt(subMessage.length - 1) === ' ') {
            subMessage = subMessage.substring(0, subMessage.length - 1);
          }
  
          messageParts.push(subMessage);
          message = message.substring(subMessage.length).trim();
        }
      }
  
      for (const part of messageParts) {
        await channel.send(part);
      }
    }
  }
}

module.exports = BroadcastService;