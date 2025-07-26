# API Setup Instructions for Blindspots

To use all features of the Blindspots application, you need to set up API keys for various services. Follow these instructions:

## Quick Setup

1. For local development, use `.env.local` (recommended):
   ```bash
   cp .env.example .env.local
   ```

2. Open the `.env.local` file and replace the placeholder values with your actual API keys.

**Note**: `.env.local` is ignored by git and perfect for storing sensitive API keys during development.

## Required API Keys

### 1. OpenAI API Key (Required for voice analysis)

- Go to <https://platform.openai.com/api-keys>
- Create a new API key
- Replace `your-openai-api-key` in `.env` with your actual key

### 2. Anthropic API Key (Required for behavioral analysis)

- Go to <https://console.anthropic.com/settings/keys>
- Create a new API key
- Replace `your-anthropic-api-key` in `.env` with your actual key

### 3. Google Cloud API (Optional - for advanced vision analysis)

- Go to <https://console.cloud.google.com/>
- Create a new project or select existing
- Enable the Vision API
- Create credentials (API key)
- Replace `your-google-api-key` and `your-google-cloud-project-id` in `.env`

### 4. Supabase (Optional - for data persistence)

- Go to <https://supabase.com/dashboard>
- Create a new project
- Go to Settings > API
- Copy the Project URL and anon/public key
- Replace `your-supabase-project-url` and `your-supabase-anon-key` in `.env`

### 5. GitHub (Optional - for exporting reports)

- Go to <https://github.com/settings/tokens>
- Generate a new token with `repo` scope
- Replace `your-github-personal-access-token` in `.env`
- Also update `your-github-username` with your GitHub username

## Testing Your Setup

1. Open the app and click the Settings button (gear icon)
2. Check the "API Status" section - green dots indicate connected services
3. If you see issues with camera access:
   - Click "Test Camera Permissions" in the settings
   - Make sure you're using HTTPS or localhost
   - Grant camera permissions when prompted

## Minimum Requirements

At minimum, you need either:

- OpenAI API key for basic functionality
- OR Anthropic API key for advanced analysis

The app will work with partial API keys but some features may be limited.

## Troubleshooting

### Camera not working?

1. Check browser permissions (icon in address bar)
2. Make sure you're on HTTPS or localhost
3. Try the "Test Camera Permissions" button in settings

### API errors?

1. Verify your API keys are correct (no extra spaces)
2. Check if you have credits/quota on your API accounts
3. Look at browser console for detailed error messages

### Still having issues?

- The app will show which APIs failed in the UI
- Check the browser console (F12) for detailed error messages
- Make sure your `.env` file is in the root directory
- Restart the development server after changing `.env`
