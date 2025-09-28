'use server';

import { 
  generateStrongPassword, 
  type GenerateStrongPasswordInput,
  type GenerateStrongPasswordOutput,
} from '@/ai/flows/generate-strong-password';

export async function generatePasswordAction(input: GenerateStrongPasswordInput): Promise<GenerateStrongPasswordOutput> {
  try {
    const output = await generateStrongPassword(input);
    return output;
  } catch (error) {
    console.error("Error in generatePasswordAction:", error);
    throw new Error("Failed to generate password.");
  }
}
