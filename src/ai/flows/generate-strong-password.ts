'use server';

/**
 * @fileOverview Password generation flow.
 *
 * - generateStrongPassword - A function that generates a strong password based on user criteria.
 * - GenerateStrongPasswordInput - The input type for the generateStrongPassword function.
 * - GenerateStrongPasswordOutput - The return type for the generateStrongPassword function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const GenerateStrongPasswordInputSchema = z.object({
  length: z.number().describe('The desired length of the password.'),
  useLowercase: z.boolean().describe('Whether to include lowercase characters.'),
  useUppercase: z.boolean().describe('Whether to include uppercase characters.'),
  useNumbers: z.boolean().describe('Whether to include numbers.'),
  useSymbols: z.boolean().describe('Whether to include symbols.'),
});
export type GenerateStrongPasswordInput = z.infer<typeof GenerateStrongPasswordInputSchema>;

const GenerateStrongPasswordOutputSchema = z.object({
  password: z.string().describe('The generated strong password.'),
});
export type GenerateStrongPasswordOutput = z.infer<typeof GenerateStrongPasswordOutputSchema>;

export async function generateStrongPassword(
  input: GenerateStrongPasswordInput
): Promise<GenerateStrongPasswordOutput> {
  return generateStrongPasswordFlow(input);
}

const prompt = ai.definePrompt({
  name: 'generateStrongPasswordPrompt',
  input: {schema: GenerateStrongPasswordInputSchema},
  output: {schema: GenerateStrongPasswordOutputSchema},
  prompt: `You are a password generator. Generate a strong password based on the following criteria:

Length: {{{length}}}
Include lowercase characters: {{#if useLowercase}}Yes{{else}}No{{/if}}
Include uppercase characters: {{#if useUppercase}}Yes{{else}}No{{/if}}
Include numbers: {{#if useNumbers}}Yes{{else}}No{{/if}}
Include symbols: {{#if useSymbols}}Yes{{else}}No{{/if}}

The password should be random and difficult to guess. Return only the generated password.
`,
});

const generateStrongPasswordFlow = ai.defineFlow(
  {
    name: 'generateStrongPasswordFlow',
    inputSchema: GenerateStrongPasswordInputSchema,
    outputSchema: GenerateStrongPasswordOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
