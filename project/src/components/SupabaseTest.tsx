import React, { useState } from 'react';
import { supabase } from '../lib/supabase';

export const SupabaseTest: React.FC = () => {
  const [testResult, setTestResult] = useState<string>('');
  const [isLoading, setIsLoading] = useState(false);

  const testConnection = async () => {
    setIsLoading(true);
    setTestResult('Testing connection...');

    try {
      // Check environment variables
      const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
      const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

      if (!supabaseUrl || !supabaseAnonKey) {
        setTestResult('❌ Missing environment variables: VITE_SUPABASE_URL or VITE_SUPABASE_ANON_KEY');
        return;
      }

      setTestResult('✅ Environment variables found\n');

      // Test basic connection
      const { data, error } = await supabase
        .from('opportunities')
        .select('count')
        .limit(1);

      if (error) {
        setTestResult(prev => prev + `❌ Connection error: ${error.message}`);
        return;
      }

      setTestResult(prev => prev + '✅ Supabase connection successful\n');

      // Test applications table
      const { error: appError } = await supabase
        .from('applications')
        .select('count')
        .limit(1);

      if (appError) {
        setTestResult(prev => prev + `❌ Applications table error: ${appError.message}`);
        return;
      }

      setTestResult(prev => prev + '✅ Applications table accessible');

    } catch (error) {
      setTestResult(`❌ Unexpected error: ${error instanceof Error ? error.message : 'Unknown error'}`);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="p-4 bg-zinc-800 rounded-lg">
      <h3 className="text-white font-semibold mb-2">Supabase Connection Test</h3>
      <button
        onClick={testConnection}
        disabled={isLoading}
        className="px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 disabled:opacity-50"
      >
        {isLoading ? 'Testing...' : 'Test Connection'}
      </button>
      {testResult && (
        <pre className="mt-4 p-3 bg-zinc-900 text-green-400 text-sm rounded overflow-auto">
          {testResult}
        </pre>
      )}
    </div>
  );
}; 