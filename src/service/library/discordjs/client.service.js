const { Client } = require('discord.js');
const ConfigService = require('../../system/config.service');

class ClientService {
  client;
  configService;

  constructor() {
    this.configService = new ConfigService();
    this.client = this.createClient();
  }

  createClient() {
    return new Client({intents: 32767});
  }   

  get Client() {
    return this.client;
  }

  getBotToken() {
    return this.configService.getConfigValue('Client.botToken'); // Use the getConfigValue method with the correct key
  }

  async login() {
    try {
      const botToken = this.getBotToken(); 
      await this.client.login(botToken);
      console.log('Bot is now connected!');
    } catch (error) {
      console.error('Error connecting to Discord:', error);
    }
  }
}

module.exports = ClientService;
