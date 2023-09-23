import OpenAI from 'openai';
import { OpenAIStream, StreamingTextResponse } from 'ai';

// Create an OpenAI API client (that's edge friendly!)
const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
});

// Set the runtime to edge for best performance
export const runtime = 'edge';

export async function POST(req: Request) {
    const { prompt } = await req.json();

    const response = await openai.completions.create({
        model: 'text-davinci-003',
        stream: true,
        temperature: 0.6,
        max_tokens: 300,
        prompt: `your next output must be a single word. I want to know more about ${prompt}. what should I explore?`,
    });
    const stream = OpenAIStream(response)
    // Respond with the stream
    return new StreamingTextResponse(stream);
}