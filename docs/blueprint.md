# **App Name**: REvamp Authenticator

## Core Features:

- Email/Password Authentication: Allow users to sign up and log in using their email and password.
- Google OAuth: Enable users to sign up and log in using their Google account.
- Multi-Step Registration: Implement a six-step registration form to collect user information.
- User Data Storage: Store user data in Firestore upon signup, including name, email, college, year, college email, verification status, and creation timestamp.
- Protected Routes: Implement middleware to protect routes, ensuring only authenticated users can access them (e.g., /dashboard).
- Admin Role Detection: Implement logic to detect admin roles based on custom claims.
- Access Control Tool: AI tool will decide who has permission to modify various document types stored in Firestore.

## Style Guidelines:

- Primary color: Deep violet (#673AB7) for a sophisticated and modern feel.
- Background color: Light violet (#F3E5F5), subtly desaturated, providing a clean backdrop.
- Accent color: Indigo (#3F51B5), darker and more saturated than the primary color to provide good contrast on CTAs.
- Body: 'Inter' is a sans-serif font with a modern, neutral look, suitable for body text
- Headline: 'Space Grotesk' is a proportional sans-serif with a computerized, techy, scientific feel that contrasts well with Inter.
- Use consistent and modern icons from a library like Feather or Material Icons.
- Maintain a clean and responsive layout using Tailwind CSS, ensuring readability and usability across devices.