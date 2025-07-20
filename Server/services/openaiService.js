import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey:"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" || process.env.OPENAI_API_KEY ,
});

export const getAIResponse = async (message) => {
  try {
    const completion = await openai.chat.completions.create({
      model: 'gpt-4o-mini',  // or 'gpt-4' if available
      messages: [
        { role: 'user', content: message },
      ],
      max_tokens: 1000,
      temperature: 0.7,
    });

    const aiText = completion.choices[0].message.content;
    console.log('AI Response:', aiText); 
    return aiText;
  } catch (error) {
    console.error('OpenAI API Error:', error);
    throw new Error('Failed to get response from AI');
  }
};
