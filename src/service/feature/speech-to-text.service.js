const speech = require('@google-cloud/speech');

class SpeechToTextService {
  constructor() {
    this.client = new speech.SpeechClient();
  }

  async transcribe(audioBuffer, encoding = 'LINEAR16', sampleRateHertz = 16000, languageCode = 'en-US') {
    const request = {
      audio: {
        content: audioBuffer.toString('base64'),
      },
      config: {
        encoding: encoding,
        sampleRateHertz: sampleRateHertz,
        languageCode: languageCode,
      },
    };

    try {
      const [response] = await this.client.recognize(request);
      const transcription = response.results
        .map(result => result.alternatives[0].transcript)
        .join('\n');
      return transcription;
    } catch (error) {
      console.error('Error transcribing audio:', error);
      throw error;
    }
  }
}

module.exports = SpeechToTextService;
