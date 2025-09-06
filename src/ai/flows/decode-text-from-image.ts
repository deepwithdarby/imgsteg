'use server';

/**
 * @fileOverview Extracts a hidden text message from an encoded image.
 *
 * - decodeTextFromImage - A function that handles the decoding process.
 * - DecodeTextFromImageInput - The input type for the decodeTextFromImage function.
 * - DecodeTextFromImageOutput - The return type for the decodeTextFromImage function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const DecodeTextFromImageInputSchema = z.object({
  encodedImageDataUri: z
    .string()
    .describe(
      'The encoded image as a data URI that must include a MIME type and use Base64 encoding. Expected format: \'data:<mimetype>;base64,<encoded_data>\'.' // prettier-ignore
    ),
});
export type DecodeTextFromImageInput = z.infer<
  typeof DecodeTextFromImageInputSchema
>;

const DecodeTextFromImageOutputSchema = z.object({
  decodedText: z
    .string()
    .describe('The extracted text message from the encoded image.'),
  validationResult: z
    .string()
    .describe('The validation result of the decoded text.'),
});
export type DecodeTextFromImageOutput = z.infer<
  typeof DecodeTextFromImageOutputSchema
>;

export async function decodeTextFromImage(
  input: DecodeTextFromImageInput
): Promise<DecodeTextFromImageOutput> {
  return decodeTextFromImageFlow(input);
}

const prompt = ai.definePrompt({
  name: 'decodeTextFromImagePrompt',
  input: {schema: DecodeTextFromImageInputSchema},
  output: {schema: DecodeTextFromImageOutputSchema},
  prompt: `You are an expert in decoding steganography images. Extract the hidden message from the following image. Validate for common encoding errors.

Image: {{media url=encodedImageDataUri}}

Output the decoded text and a validation of the quality of the decoding, based on common errors.`, // prettier-ignore
});

const decodeTextFromImageFlow = ai.defineFlow(
  {
    name: 'decodeTextFromImageFlow',
    inputSchema: DecodeTextFromImageInputSchema,
    outputSchema: DecodeTextFromImageOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
