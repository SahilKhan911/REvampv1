'use server';

/**
 * @fileOverview A Genkit flow for suggesting Firestore security rules based on data structure and access control requirements.
 *
 * - firestoreSecuritySuggestion - A function that takes a description of the Firestore schema and access control requirements and returns a suggested set of security rules.
 * - FirestoreSecuritySuggestionInput - The input type for the firestoreSecuritySuggestion function.
 * - FirestoreSecuritySuggestionOutput - The return type for the firestoreSecuritySuggestion function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const FirestoreSecuritySuggestionInputSchema = z.object({
  schemaDescription: z
    .string()
    .describe(
      'A detailed description of the Firestore schema, including collection names, document structures, and data types.'
    ),
  accessControlRequirements: z
    .string()
    .describe(
      'A clear and concise description of the access control requirements for the Firestore database, including user roles and permissions.'
    ),
});
export type FirestoreSecuritySuggestionInput = z.infer<
  typeof FirestoreSecuritySuggestionInputSchema
>;

const FirestoreSecuritySuggestionOutputSchema = z.object({
  securityRules: z
    .string()
    .describe(
      'The suggested Firestore security rules based on the provided schema description and access control requirements.'
    ),
});
export type FirestoreSecuritySuggestionOutput = z.infer<
  typeof FirestoreSecuritySuggestionOutputSchema
>;

export async function firestoreSecuritySuggestion(
  input: FirestoreSecuritySuggestionInput
): Promise<FirestoreSecuritySuggestionOutput> {
  return firestoreSecuritySuggestionFlow(input);
}

const prompt = ai.definePrompt({
  name: 'firestoreSecuritySuggestionPrompt',
  input: {schema: FirestoreSecuritySuggestionInputSchema},
  output: {schema: FirestoreSecuritySuggestionOutputSchema},
  prompt: `You are an expert in designing Firestore security rules.

  Based on the provided Firestore schema description and access control requirements, generate a set of Firestore security rules that enforce the specified permissions.

  Ensure that the generated rules are secure, efficient, and follow Firestore security best practices.

  Schema Description: {{{schemaDescription}}}
  Access Control Requirements: {{{accessControlRequirements}}}

  Return the security rules in a format that can be directly copied and pasted into the Firestore security rules editor.
`,
});

const firestoreSecuritySuggestionFlow = ai.defineFlow(
  {
    name: 'firestoreSecuritySuggestionFlow',
    inputSchema: FirestoreSecuritySuggestionInputSchema,
    outputSchema: FirestoreSecuritySuggestionOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
