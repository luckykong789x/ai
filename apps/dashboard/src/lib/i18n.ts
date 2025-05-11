interface Translations {
  [key: string]: {
    [key: string]: string;
  };
}

const translations: Translations = {
  en: {
    dashboard: 'Dashboard',
    providers: 'Providers',
    promptModules: 'Prompt Modules',
    executions: 'Executions',
    settings: 'Settings',
    pipelines: 'Pipelines',
    version: 'Version',
    send: 'Send',
    typeMessage: 'Type your message...',
    chatTitle: 'Orchestration Test Chat',
    integrated: 'Integrated-FB Loop & PLE Enhanced',
  },
  ja: {
    dashboard: 'ダッシュボード',
    providers: 'プロバイダー',
    promptModules: 'プロンプトモジュール',
    executions: '実行履歴',
    settings: '設定',
    pipelines: 'パイプライン',
    version: 'バージョン',
    send: '送信',
    typeMessage: 'メッセージを入力...',
    chatTitle: 'オーケストレーションテストチャット',
    integrated: '統合FBループ & PLE強化版',
  }
};

let currentLanguage = 'en';

export const setLanguage = (lang: string) => {
  if (translations[lang]) {
    currentLanguage = lang;
  }
};

export const getLanguage = () => currentLanguage;

export const t = (key: string): string => {
  if (translations[currentLanguage] && translations[currentLanguage][key]) {
    return translations[currentLanguage][key];
  }
  
  if (translations['en'] && translations['en'][key]) {
    return translations['en'][key];
  }
  
  return key;
};
