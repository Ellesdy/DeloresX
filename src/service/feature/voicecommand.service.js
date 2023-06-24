const { VoiceReceiver } = require('discord.js');
const SpeechToTextService = require('./speech-to-text.service');

class VoiceCommandService {
  constructor(vcManagerService) {
    this.vcManagerService = vcManagerService;
    this.speechToTextService = new SpeechToTextService();
  }

  async joinChannel(channel) {
    const connection = await channel.join();
    const receiver = connection.receiver;
    receiver.on('pcm', this.handleVoiceData.bind(this));
  }

  async handleVoiceData(data) {
    const text = await this.speechToTextService.convert(data);
    const command = this.parseCommand(text);
    this.vcManagerService.handleCommand(command);
  }

  parseCommand(text) {
    // Parse the text into a command and arguments
  }
}

module.exports = VoiceCommandService;
