import OpenAI from 'openai';
import fs from 'fs';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export const transcribeAudio = async (filePath) => {
  try {
    const transcription = await openai.audio.transcriptions.create({
      file: fs.createReadStream(filePath),
      model: 'whisper-1',
      language: 'en', // Change to 'auto' if you want auto-detection
    });

    return transcription.text;
  } catch (error) {
    console.error('Whisper API Error:', error);
    throw new Error('Failed to transcribe audio');
  }
};
