import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { t } from '@/lib/i18n';

const Login = () => {
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const { login, remainingAttempts, isLocked, lockoutTimeRemaining } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (isLocked) {
      setError(t('accountLocked'));
      return;
    }

    const success = login(password);
    if (success) {
      navigate('/');
    } else {
      setError(t('invalidPassword'));
    }
  };

  const formatLockoutTime = () => {
    const minutes = Math.floor(lockoutTimeRemaining / 60000);
    const seconds = Math.floor((lockoutTimeRemaining % 60000) / 1000);
    return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-base">
      <Card className="w-full max-w-md p-8 bg-gray-800 border-gray-700">
        <div className="text-center mb-8">
          <h1 className="text-2xl font-bold text-white mb-2">AI Prompt Orchestration</h1>
          <p className="text-gray-400">{t('loginRequired')}</p>
        </div>

        {isLocked ? (
          <div className="bg-red-900/30 border border-red-800 rounded-lg p-4 mb-6">
            <p className="text-red-300 text-center">
              {t('accountLockedMessage')} {formatLockoutTime()}
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-400 mb-2">
                {t('password')}
              </label>
              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-accent"
                placeholder="••••••••••••••••"
                required
              />
            </div>

            {error && (
              <div className="bg-red-900/30 border border-red-800 rounded-lg p-3">
                <p className="text-red-300 text-sm">{error}</p>
                {remainingAttempts > 0 && (
                  <p className="text-red-300 text-sm mt-1">
                    {t('attemptsRemaining')}: {remainingAttempts}
                  </p>
                )}
              </div>
            )}

            <Button type="submit" className="w-full">
              {t('login')}
            </Button>
          </form>
        )}
      </Card>
    </div>
  );
};

export default Login;
