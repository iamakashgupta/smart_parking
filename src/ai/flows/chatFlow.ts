
'use server';
/**
 * @fileOverview A conversational AI flow for the SmartPark chatbot.
 *
 * - sendMessage: A function to handle chat messages.
 * - ChatInput: The input type for the sendMessage function.
 */

import { ai } from '@/ai/genkit';
import { z } from 'zod';

const ChatHistorySchema = z.object({
  role: z.enum(['user', 'bot']),
  text: z.string(),
});

const ChatInputSchema = z.object({
  message: z.string(),
  history: z.array(ChatHistorySchema).optional(),
});
export type ChatInput = z.infer<typeof ChatInputSchema>;

// The main function exported to the client
export async function sendMessage(input: ChatInput): Promise<string> {
  return await chatFlow(input);
}

const chatPrompt = ai.definePrompt({
  name: 'chatPrompt',
  input: { schema: ChatInputSchema },
  output: { format: 'text' },
  prompt: `You are a friendly and helpful chatbot assistant for an app called SmartPark. Your goal is to assist users with finding parking, managing their bookings, and using the app.

Keep your responses concise and to the point.

Available features in the app:
- Find parking lots on a map or in a list.
- View real-time availability and pricing for each lot.
- Book a parking spot in advance (reservation) or for immediate use (book now).
- Manage user profile and add/remove vehicles.
- View booking history and receipts.
- Use a QR code for entry/exit.
- Admin panel for managing lots and viewing all bookings (for admins only).

Conversation History:
{{#if history}}
{{#each history}}
{{#if (eq role 'user')}}
User: {{{text}}}
{{/if}}
{{#if (eq role 'bot')}}
Assistant: {{{text}}}
{{/if}}
{{/each}}
{{/if}}

New user message:
{{{message}}}

Assistant:`,
});

// The Genkit flow that orchestrates the AI call
const chatFlow = ai.defineFlow(
  {
    name: 'chatFlow',
    inputSchema: ChatInputSchema,
    outputSchema: z.string(),
  },
  async (input) => {
    const response = await chatPrompt(input);
    return response.text;
  }
);
