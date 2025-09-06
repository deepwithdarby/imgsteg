// Encode Text to Image Flow
'use server';

/**
 * @fileOverview A flow to encode a text message within an image.
 *
 * - encodeTextToImage - A function that handles the encoding process.
 * - EncodeTextToImageInput - The input type for the encodeTextToImage function.
 * - EncodeTextToImageOutput - The return type for the encodeTextToImage function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const EncodeTextToImageInputSchema = z.object({
  photoDataUri: z
    .string()
    .describe(
      'A photo to encode the text into, as a data URI that must include a MIME type and use Base64 encoding. Expected format: \'data:<mimetype>;base64,<encoded_data>\'.' // the single quotes are escaped
    ),
  text: z.string().describe('The text to encode into the image.'),
});
export type EncodeTextToImageInput = z.infer<typeof EncodeTextToImageInputSchema>;

const EncodeTextToImageOutputSchema = z.object({
  encodedImageDataUri: z
    .string()
    .describe(
      'The encoded image, as a data URI that must include a MIME type and use Base64 encoding. Expected format: \'data:<mimetype>;base64,<encoded_data>\'.' // the single quotes are escaped
    ),
});
export type EncodeTextToImageOutput = z.infer<typeof EncodeTextToImageOutputSchema>;

export async function encodeTextToImage(input: EncodeTextToImageInput): Promise<EncodeTextToImageOutput> {
  return encodeTextToImageFlow(input);
}

const textEncodingPrompt = ai.definePrompt({
  name: 'textEncodingPrompt',
  input: {schema: EncodeTextToImageInputSchema},
  output: {schema: EncodeTextToImageOutputSchema},
  prompt: `You are an expert at encoding text messages inside images.

You will receive an image and a text string.

Encode the text inside the image, and return the encoded image as a data URI.

Image: {{media url=photoDataUri}}

Text: {{{text}}}`, // triple curly braces to prevent escaping
});

const encodeTextToImageFlow = ai.defineFlow(
  {
    name: 'encodeTextToImageFlow',
    inputSchema: EncodeTextToImageInputSchema,
    outputSchema: EncodeTextToImageOutputSchema,
  },
  async input => {
    const {output} = await textEncodingPrompt(input);
    return output!;
  }
);
