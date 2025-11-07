# Firebase Studio

This is a Next.js starter project built in Firebase Studio. It includes a full-featured student community platform with events, workshops, authentication, and admin management.

To get started, take a look at `src/app/page.tsx`.

## Configuration

To run the application locally, you need to set up your environment variables.

1.  **Create an Environment File:**
    Rename the `.env.example` file in the root of the project to `.env` (if one doesn't exist already).

2.  **Fill in Environment Variables:**
    Open the `.env` file and add the following configuration.

    ```bash
    # The email address for the account that should have admin privileges.
    NEXT_PUBLIC_ADMIN_EMAIL="your.admin.email@example.com"

    # The embed URL for your Luma calendar.
    # See: https://support.lu.ma/article/d2a3h25t7j-embed-luma
    NEXT_PUBLIC_LUMA_CALENDAR_URL="YOUR_LUMA_CALENDAR_EMBED_URL"

    # --- Razorpay API Keys ---
    # Found in your Razorpay Dashboard under Settings -> API Keys.
    # It's recommended to use Test Mode keys for development.

    # Your public-facing Razorpay Key ID (for the client-side).
    NEXT_PUBLIC_RAZORPAY_KEY_ID="rzp_test_..."

    # Your Razorpay Key Secret (for the server-side).
    RAZORPAY_KEY_SECRET="YOUR_RAZORPAY_KEY_SECRET"
    ```

### How to get Razorpay API Keys

1.  Log in to your [Razorpay Dashboard](https://dashboard.razorpay.com/).
2.  Navigate to **Account & Settings** > **API Keys**.
3.  You will find your **Key ID** and can generate a **Key Secret**. It is highly recommended to use **Test Mode** keys for development and testing.
4.  Copy these values and paste them into your `.env` file.

### Admin Access

The user who signs in with the email address specified in `NEXT_PUBLIC_ADMIN_EMAIL` will be granted administrator privileges across the application.
