// Environment variable validation utility
export interface EnvValidationResult {
  isValid: boolean;
  missing: string[];
  warnings: string[];
}

export function validateEnvironmentVariables(): EnvValidationResult {
  const required = [
    'REACT_APP_SUPABASE_URL',
    'REACT_APP_SUPABASE_ANON_KEY',
  ];

  const optional = [
    'REACT_APP_OPENAI_API_KEY',
    'REACT_APP_ANTHROPIC_API_KEY',
    'REACT_APP_GITHUB_PAT',
  ];

  const missing: string[] = [];
  const warnings: string[] = [];

  // Check required variables
  required.forEach(varName => {
    if (!process.env[varName]) {
      missing.push(varName);
    }
  });

  // Check optional variables
  optional.forEach(varName => {
    if (!process.env[varName]) {
      warnings.push(`Optional: ${varName} is not set. Some features may be limited.`);
    }
  });

  // Security check: Make sure no API keys are exposed in production builds
  if (process.env.NODE_ENV === 'production') {
    const dangerousVars = [
      'REACT_APP_GOOGLE_API_KEY',
      'GOOGLE_API_KEY',
    ];

    dangerousVars.forEach(varName => {
      if (process.env[varName]) {
        warnings.push(`SECURITY WARNING: ${varName} should not be exposed in client-side code!`);
      }
    });
  }

  return {
    isValid: missing.length === 0,
    missing,
    warnings
  };
}

export function getSecureConfig() {
  const validation = validateEnvironmentVariables();
  
  if (!validation.isValid) {
    console.error('Missing required environment variables:', validation.missing);
    throw new Error('Application configuration is incomplete. Please check your .env file.');
  }

  if (validation.warnings.length > 0) {
    validation.warnings.forEach(warning => console.warn(warning));
  }

  return {
    supabase: {
      url: process.env.REACT_APP_SUPABASE_URL!,
      anonKey: process.env.REACT_APP_SUPABASE_ANON_KEY!,
    },
    // Optional API keys - these should be used through secure backend proxies
    apis: {
      openai: process.env.REACT_APP_OPENAI_API_KEY,
      anthropic: process.env.REACT_APP_ANTHROPIC_API_KEY,
      github: process.env.REACT_APP_GITHUB_PAT,
    }
  };
}