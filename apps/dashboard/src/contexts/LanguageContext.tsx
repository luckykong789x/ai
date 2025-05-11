import React, { createContext, useState, useContext, ReactNode } from 'react';

type Language = 'en' | 'ja';

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
}

const translations = {
  en: {
    dashboard: 'Dashboard',
    providers: 'Providers',
    promptModules: 'Prompt Modules',
    executions: 'Executions',
    settings: 'Settings',
    addNewProvider: 'Add New Provider',
    createNewModule: 'Create New Module',
    newExecution: 'New Execution',
    systemSettings: 'System Settings',
    iflPolicy: 'Integrated Feedback Loop Policy',
    pleCache: 'Prompt Linkage Engine Cache',
    uiSettings: 'UI Settings',
    performanceMetrics: 'Performance Metrics',
    recentExecutions: 'Recent Executions',
    registeredProviders: 'Registered Providers',
  },
  ja: {
    dashboard: 'ダッシュボード',
    providers: 'プロバイダー',
    promptModules: 'プロンプトモジュール',
    executions: '実行履歴',
    settings: '設定',
    addNewProvider: '新規プロバイダー追加',
    createNewModule: '新規モジュール作成',
    newExecution: '新規実行',
    systemSettings: 'システム設定',
    iflPolicy: '統合フィードバックループポリシー',
    pleCache: 'プロンプトリンケージエンジンキャッシュ',
    uiSettings: 'UI設定',
    performanceMetrics: 'パフォーマンスメトリクス',
    recentExecutions: '最近の実行',
    registeredProviders: '登録済みプロバイダー',
  }
};

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const LanguageProvider = ({ children }: { children: ReactNode }) => {
  const [language, setLanguage] = useState<Language>('en');

  const t = (key: string): string => {
    return translations[language][key as keyof typeof translations[typeof language]] || key;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = (): LanguageContextType => {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};
