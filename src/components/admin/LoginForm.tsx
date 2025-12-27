import { useState } from 'react';
import { Lock, Eye, EyeOff } from 'lucide-react';
import { Input, Button } from '../ui';

export default function LoginForm() {
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password }),
      });

      const result = await response.json();

      if (result.success) {
        // Redirect to dashboard
        window.location.href = '/admin/dashboard';
      } else {
        setError(result.error || 'Invalid password');
      }
    } catch (err) {
      setError('Failed to login. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {error && (
        <div className="p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
          <p className="text-sm text-red-600 dark:text-red-400">{error}</p>
        </div>
      )}

      <div className="relative">
        <Input
          type={showPassword ? 'text' : 'password'}
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Enter admin password"
          required
          label="Password"
          className="pr-10"
        />
        <button
          type="button"
          onClick={() => setShowPassword(!showPassword)}
          className="absolute right-3 top-[38px] text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
        >
          {showPassword ? (
            <EyeOff className="w-5 h-5" />
          ) : (
            <Eye className="w-5 h-5" />
          )}
        </button>
      </div>

      <Button
        type="submit"
        variant="primary"
        className="w-full"
        isLoading={isLoading}
      >
        <Lock className="w-4 h-4 mr-2" />
        Sign In
      </Button>

      <div className="text-sm text-gray-600 dark:text-gray-400">
        <p>💡 Default password is set in <code className="px-1 py-0.5 bg-gray-100 dark:bg-gray-800 rounded">.env</code> file</p>
      </div>
    </form>
  );
}
