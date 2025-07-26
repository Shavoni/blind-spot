# Supabase Edge Functions for Blind Spot

This directory contains secure edge functions that proxy API calls to external services, preventing API key exposure in the client-side code.

## Setup Instructions

### 1. Install Supabase CLI

```bash
npm install -g supabase
```

### 2. Login to Supabase

```bash
supabase login
```

### 3. Link to your Supabase project

```bash
supabase link --project-ref <your-project-ref>
```

### 4. Set up environment variables

Create a `.env` file in the `supabase` directory:

```env
GOOGLE_API_KEY=your_google_api_key_here
```

### 5. Deploy the functions

```bash
# Deploy all functions
supabase functions deploy

# Or deploy a specific function
supabase functions deploy google-vision
```

### 6. Set secrets in production

```bash
supabase secrets set GOOGLE_API_KEY=your_google_api_key_here
```

## Function Details

### google-vision

This function provides secure proxy endpoints for Google Vision API calls:

- **Endpoint**: `https://<project-ref>.supabase.co/functions/v1/google-vision`
- **Authentication**: Requires valid Supabase user session
- **Actions**:
  - `analyzeFacialExpressions`: Analyzes facial expressions in images
  - `analyzeGestures`: Analyzes body gestures in images/video frames
  - `analyzeVideoFrame`: Analyzes individual video frames

## Security Notes

1. **Never expose API keys in client code**: All sensitive API keys should be stored as Supabase secrets
2. **Authentication required**: All endpoints require a valid Supabase authentication token
3. **CORS configured**: The functions are configured to accept requests from your application domain

## Testing Locally

To test functions locally:

```bash
supabase functions serve google-vision --env-file ./supabase/.env
```

The function will be available at `http://localhost:54321/functions/v1/google-vision`

## Troubleshooting

1. **Function not found**: Ensure the function is deployed with `supabase functions deploy`
2. **Authentication errors**: Check that you're sending a valid Bearer token in the Authorization header
3. **API errors**: Verify your Google API key is valid and has the Vision API enabled