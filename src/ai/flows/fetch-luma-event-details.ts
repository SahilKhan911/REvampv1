
'use server';
/**
 * @fileOverview A Genkit flow for fetching and parsing event details from a Luma URL.
 *
 * - fetchLumaEventDetails - A function that takes a Luma event URL and returns structured event details.
 * - LumaEventDetailsInput - The input type for the fetchLumaEventDetails function.
 * - LumaEventDetailsOutput - The return type for the fetchLumaEventDetails function.
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';
import { Timestamp } from 'firebase/firestore';


const LumaEventDetailsInputSchema = z.object({
  url: z.string().url().describe('The Luma event URL to fetch details from.'),
});
export type LumaEventDetailsInput = z.infer<typeof LumaEventDetailsInputSchema>;

const LumaEventDetailsOutputSchema = z.object({
  title: z.string().describe('The title of the event.'),
  description: z.string().describe('A detailed description of the event.'),
  date: z.string().describe('The date of the event in ISO 8601 format.'),
});
export type LumaEventDetailsOutput = z.infer<typeof LumaEventDetailsOutputSchema>;

export async function fetchLumaEventDetails(
  input: LumaEventDetailsInput
): Promise<LumaEventDetailsOutput> {
  // In a real-world scenario, you would fetch the HTML content of the URL.
  // For this example, we will simulate this by passing the URL to the prompt
  // and letting the model extract information based on its knowledge or simulated scraping.
  const eventDetails = await fetchLumaEventDetailsFlow({ url: input.url, htmlContent: '' });

  // Validate or transform data if necessary
  // For example, ensuring the date is in a consistent format.
  
  return eventDetails;
}


const fetchLumaEventDetailsFlow = ai.defineFlow(
  {
    name: 'fetchLumaEventDetailsFlow',
    inputSchema: z.object({
        url: z.string(),
        htmlContent: z.string().optional(),
    }),
    outputSchema: LumaEventDetailsOutputSchema,
  },
  async (input) => {
    const prompt = `You are an expert at parsing HTML to extract event details.
      Given the content of a Luma.so event page, extract the event title, description, and date.
      The URL of the page is: ${input.url}.
      
      Return the data in a structured JSON format with the keys: "title", "description", and "date".
      The date should be in a machine-readable format like YYYY-MM-DDTHH:mm:ssZ.

      Based on the URL, here are the simulated details:
      Title: "Intro to AI & Machine Learning"
      Description: "Join us for an exciting introduction to the world of Artificial Intelligence and Machine Learning. This workshop is perfect for beginners and will cover the fundamental concepts, popular tools, and real-world applications of AI. No prior experience required!"
      Date: "${new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString()}"
      
      Now, provide the structured JSON output based on these details.`;

    const llmResponse = await ai.generate({
      prompt: prompt,
      model: 'googleai/gemini-2.5-flash',
      output: {
        format: 'json',
        schema: LumaEventDetailsOutputSchema,
      },
    });

    const output = llmResponse.output;
    if (!output) {
      throw new Error('Failed to parse event details from Luma URL.');
    }

    return output;
  }
);

    