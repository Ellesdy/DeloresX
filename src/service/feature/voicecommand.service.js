const { VoiceReceiver } = require('discord.js');
const SpeechToTextService = require('./speech-to-text.service');

class VoiceCommandService {
  constructor(vcManagerService) {
    this.vcManagerService = vcManagerService;
    this.speechToTextService = new SpeechToTextService();
  }

  async joinAndListen(channel) {
    const connection = await channel.join();
    const receiver = connection.receiver;

    connection.on('speaking', (user, speaking) => {
      if (speaking) {
        const audioStream = receiver.createStream(user, { mode: 'pcm' });
        this.processAudioStream(audioStream);
      }
    });
  }

  async processAudioStream(audioStream) {
    // Convert the audio stream to a buffer
    const audioBuffer = [];
    audioStream.on('data', (chunk) => {
      audioBuffer.push(chunk);
    });

    audioStream.on('end', async () => {
      const buffer = Buffer.concat(audioBuffer);
      const transcription = await this.speechToTextService.transcribe(buffer);
      this.processTranscription(transcription);
    });
  }

  processTranscription(transcription) {
    // Process the transcribed text for commands or other relevant information
    console.log(`Transcribed Text: ${transcription}`);
    // Add your command processing logic here
  }
}

module.exports = VoiceCommandService;
