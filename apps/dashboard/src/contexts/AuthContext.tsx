import { createContext, useState, useContext, useEffect, ReactNode } from 'react';

const INITIAL_PASSWORD = 'sk-proj-aEGKST5XpkFz1AIOM';
const MAX_ATTEMPTS = 5;
const LOCKOUT_TIME = 15 * 60 * 1000; // 15 minutes in milliseconds

interface AuthContextType {
  isAuthenticated: boolean;
  login: (password: string) => boolean;
  logout: () => void;
  remainingAttempts: number;
  isLocked: boolean;
  lockoutTimeRemaining: number;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [remainingAttempts, setRemainingAttempts] = useState<number>(MAX_ATTEMPTS);
  const [lockoutTime, setLockoutTime] = useState<number>(0);
  const [lockoutTimeRemaining, setLockoutTimeRemaining] = useState<number>(0);

  useEffect(() => {
    const storedAuth = localStorage.getItem('isAuthenticated');
    if (storedAuth === 'true') {
      setIsAuthenticated(true);
    }

    const storedLockoutTime = localStorage.getItem('lockoutTime');
    if (storedLockoutTime) {
      const lockTime = parseInt(storedLockoutTime, 10);
      setLockoutTime(lockTime);
    }

    const storedAttempts = localStorage.getItem('remainingAttempts');
    if (storedAttempts) {
      setRemainingAttempts(parseInt(storedAttempts, 10));
    }
  }, []);

  useEffect(() => {
    if (lockoutTime > 0) {
      const interval = setInterval(() => {
        const remaining = lockoutTime - Date.now();
        if (remaining <= 0) {
          setLockoutTime(0);
          setLockoutTimeRemaining(0);
          setRemainingAttempts(MAX_ATTEMPTS);
          localStorage.removeItem('lockoutTime');
          localStorage.setItem('remainingAttempts', MAX_ATTEMPTS.toString());
          clearInterval(interval);
        } else {
          setLockoutTimeRemaining(remaining);
        }
      }, 1000);

      return () => clearInterval(interval);
    }
  }, [lockoutTime]);

  const login = (password: string): boolean => {
    if (isLocked) {
      return false;
    }

    if (password === INITIAL_PASSWORD) {
      setIsAuthenticated(true);
      setRemainingAttempts(MAX_ATTEMPTS);
      localStorage.setItem('isAuthenticated', 'true');
      localStorage.setItem('remainingAttempts', MAX_ATTEMPTS.toString());
      return true;
    } else {
      const newRemainingAttempts = remainingAttempts - 1;
      setRemainingAttempts(newRemainingAttempts);
      localStorage.setItem('remainingAttempts', newRemainingAttempts.toString());

      if (newRemainingAttempts <= 0) {
        const newLockoutTime = Date.now() + LOCKOUT_TIME;
        setLockoutTime(newLockoutTime);
        localStorage.setItem('lockoutTime', newLockoutTime.toString());
      }

      return false;
    }
  };

  const logout = () => {
    setIsAuthenticated(false);
    localStorage.removeItem('isAuthenticated');
  };

  const isLocked = lockoutTime > Date.now();

  const value = {
    isAuthenticated,
    login,
    logout,
    remainingAttempts,
    isLocked,
    lockoutTimeRemaining
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
