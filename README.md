# Blind Spot - Advanced Behavioral Analysis Platform

A comprehensive React-based application for advanced behavioral analysis, forensic reporting, and AI-powered insights. This platform integrates multiple AI services and provides detailed analysis capabilities with secure API management.

## Features

- **Advanced Behavioral Analysis**: AI-powered analysis using OpenAI and Anthropic Claude
- **Forensic Reporting**: Comprehensive forensic report generation with export capabilities
- **Media Processing**: Support for image and video analysis using Google Vision API
- **Secure API Management**: Environment-based configuration with security validations
- **Real-time Analysis**: Live camera feed analysis capabilities
- **Data Storage**: Supabase integration for secure data persistence
- **Export Options**: Multiple export formats for generated reports

## Prerequisites

- Node.js (v14 or higher)
- npm or yarn package manager
- API keys for required services (see Environment Setup)

## Installation

1. Clone the repository:

```bash
git clone [repository-url]
cd blind-spot
```

2. Install dependencies:

```bash
npm install
```

3. Create environment files:

```bash
cp .env.example .env.local
```

4. Configure your environment variables (see Environment Setup section)

5. Start the development server:

```bash
npm start
```

## Environment Setup

Create a `.env.local` file in the root directory with the following variables:

### Required Variables

```bash
# Supabase Configuration
REACT_APP_SUPABASE_URL=your-supabase-project-url
REACT_APP_SUPABASE_ANON_KEY=your-supabase-anon-key

# GitHub Configuration (for saving reports)
REACT_APP_GITHUB_TOKEN=your-github-personal-access-token
REACT_APP_GITHUB_REPO_OWNER=your-github-username
REACT_APP_GITHUB_REPO_NAME=blind-spot-analyses
```

### Optional Variables (for AI features)

```bash
# AI Service APIs
REACT_APP_OPENAI_API_KEY=your-openai-api-key
REACT_APP_ANTHROPIC_API_KEY=your-anthropic-api-key
REACT_APP_GOOGLE_API_KEY=your-google-api-key
REACT_APP_GOOGLE_PROJECT_ID=your-google-cloud-project-id

# Claude Code Service
REACT_APP_CLAUDE_CODE_ENDPOINT=http://localhost:3001/claude-code
```

## Security Best Practices

### API Key Management

- **Never commit API keys**: All `.env` files are gitignored
- **Use environment variables**: All sensitive data should be in `.env.local`
- **Service role keys**: Never expose Supabase service role keys in client code
- **Key rotation**: Regularly rotate your API keys
- **Production security**: Use backend proxies for API calls in production

### Security Validations

The application includes built-in security validations:

- Automatic detection of placeholder API keys
- Warnings for exposed sensitive variables in production
- Environment variable validation on startup

### Row Level Security (RLS)

When using Supabase:

- Ensure RLS is enabled on all tables
- Use proper authentication flows
- Never expose service role keys

## Project Structure

```text
blind-spot/
├── src/
│   ├── components/       # React components
│   │   ├── ui/          # Reusable UI components
│   │   └── ...          # Feature components
│   ├── services/        # API and service integrations
│   │   ├── config.ts    # Central configuration
│   │   ├── aiServices.ts # AI service integrations
│   │   └── ...          # Other services
│   ├── utils/           # Utility functions
│   │   └── envValidation.ts # Environment validation
│   └── demo/            # Demo data and examples
├── supabase/            # Supabase functions and migrations
├── public/              # Static assets
└── API_SETUP.md         # Detailed API setup guide
```

## Available Scripts

```bash
npm start           # Start development server
npm test            # Run test suite
npm run build       # Build for production
npm run eject       # Eject from Create React App (one-way operation)
```

## API Services Integration

### Supabase

- Database and authentication
- Real-time subscriptions
- File storage for media

### OpenAI

- GPT models for text analysis
- Advanced behavioral insights

### Anthropic Claude

- Alternative AI analysis
- Complex reasoning tasks

### Google Cloud

- Vision API for image analysis
- Video intelligence features

### GitHub

- Report storage and versioning
- Collaborative analysis sharing

## Development Guidelines

1. **Code Style**: Follow existing patterns in the codebase
2. **Type Safety**: Use TypeScript types consistently
3. **Error Handling**: Implement proper error boundaries
4. **Security**: Never expose sensitive data in code
5. **Testing**: Write tests for new features

## Troubleshooting

### Common Issues

1. **Missing API Keys**
   - Check `.env.local` file exists
   - Verify all required variables are set
   - Restart development server after changes

2. **API Connection Errors**
   - Verify API keys are valid
   - Check network connectivity
   - Ensure services are not rate-limited

3. **Build Failures**
   - Clear node_modules and reinstall
   - Check for TypeScript errors
   - Verify all dependencies are installed

## Contributing

1. Create a feature branch
2. Make your changes
3. Test thoroughly
4. Submit a pull request

## License

[Your License Here]

## Support

For issues and questions:

- Check existing GitHub issues
- Create a new issue with detailed information
- Include error messages and environment details
