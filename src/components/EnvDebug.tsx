import React from 'react';

const EnvDebug = () => {
  const envVars = {
    OPENAI: process.env.REACT_APP_OPENAI_API_KEY ? '✅ Set' : '❌ Missing',
    ANTHROPIC: process.env.REACT_APP_ANTHROPIC_API_KEY ? '✅ Set' : '❌ Missing',
    GOOGLE: process.env.REACT_APP_GOOGLE_API_KEY ? '✅ Set' : '❌ Missing',
    SUPABASE_URL: process.env.REACT_APP_SUPABASE_URL ? '✅ Set' : '❌ Missing',
    SUPABASE_KEY: process.env.REACT_APP_SUPABASE_ANON_KEY ? '✅ Set' : '❌ Missing',
    GITHUB: process.env.REACT_APP_GITHUB_TOKEN ? '✅ Set' : '❌ Missing',
  };

  // Check if specific values are still placeholders
  const hasPlaceholders = {
    ANTHROPIC: process.env.REACT_APP_ANTHROPIC_API_KEY === 'your_anthropic_api_key',
    OPENAI: process.env.REACT_APP_OPENAI_API_KEY?.includes('your-openai'),
  };

  return (
    <div className="p-4 bg-gray-100 dark:bg-gray-800 rounded-lg">
      <h3 className="font-bold mb-2">Environment Variables Check:</h3>
      <div className="space-y-1 text-sm">
        {Object.entries(envVars).map(([key, value]) => (
          <div key={key} className="flex justify-between">
            <span>{key}:</span>
            <span>{value}</span>
          </div>
        ))}
      </div>
      {(hasPlaceholders.ANTHROPIC || hasPlaceholders.OPENAI) && (
        <div className="mt-3 p-2 bg-yellow-100 dark:bg-yellow-900/20 rounded text-sm">
          <p className="text-yellow-800 dark:text-yellow-200">
            ⚠️ Some API keys are still using placeholder values
          </p>
        </div>
      )}
      <div className="mt-3 text-xs text-gray-600 dark:text-gray-400">
        <p>Note: Using .env.local for sensitive values</p>
      </div>
    </div>
  );
};

export default EnvDebug;