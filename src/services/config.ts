// Environment Configuration
export const CONFIG = {
  supabase: {
    url: process.env.REACT_APP_SUPABASE_URL || '',
    anonKey: process.env.REACT_APP_SUPABASE_ANON_KEY || ''
  },
  github: {
    token: process.env.REACT_APP_GITHUB_TOKEN || '',
    owner: process.env.REACT_APP_GITHUB_REPO_OWNER || '',
    repo: process.env.REACT_APP_GITHUB_REPO_NAME || 'blind-spot-analyses'
  },
  apis: {
    openai: process.env.REACT_APP_OPENAI_API_KEY || '',
    anthropic: process.env.REACT_APP_ANTHROPIC_API_KEY || '',
    google: process.env.REACT_APP_GOOGLE_API_KEY || '',
    googleProjectId: process.env.REACT_APP_GOOGLE_PROJECT_ID || ''
  },
  claudeCode: {
    endpoint: process.env.REACT_APP_CLAUDE_CODE_ENDPOINT || 'http://localhost:3001/claude-code'
  }
};

export const isConfigValid = () => {
  return {
    supabase: !!(CONFIG.supabase.url && CONFIG.supabase.anonKey && CONFIG.supabase.url !== 'your-supabase-project-url'),
    github: !!(CONFIG.github.token && CONFIG.github.token !== 'your-github-personal-access-token'),
    openai: !!(CONFIG.apis.openai && CONFIG.apis.openai !== 'your-openai-api-key' && CONFIG.apis.openai.startsWith('sk-')),
    anthropic: !!(CONFIG.apis.anthropic && CONFIG.apis.anthropic !== 'your-anthropic-api-key' && CONFIG.apis.anthropic !== 'your_anthropic_api_key'),
    google: !!(CONFIG.apis.google && CONFIG.apis.google !== 'your-google-api-key' && CONFIG.apis.googleProjectId && CONFIG.apis.googleProjectId !== 'your-google-cloud-project-id'),
    claudeCode: true // Always available locally
  };
};