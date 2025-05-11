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
    addProvider: 'Add Provider',
    saveProvider: 'Save Provider',
    newExecution: 'New Execution',
    execute: 'Execute',
    emergencyStop: 'Emergency Stop',
    resetUI: 'Reset UI',
    providerName: 'Provider Name',
    apiKey: 'API Key',
    models: 'Models',
    priority: 'Priority',
    actions: 'Actions',
    registeredProviders: 'Registered Providers',
    addNewProvider: 'Add New Provider',
    moduleExported: 'Module Exported',
    allModulesExported: 'All Modules Exported',
    modulesImported: 'Modules Imported',
    importModules: 'Import Modules',
    exportAllModules: 'Export All Modules',
    newModule: 'New Module',
    pipelineInDevelopment: 'Pipeline feature is under development',
    saveAllChanges: 'Save All Changes',
    systemSettings: 'System Settings',
    integratedFeedbackLoop: 'Integrated Feedback Loop Policy',
    maximumRounds: 'Maximum Rounds',
    minimumScore: 'Minimum Score',
    promptLinkageEngine: 'Prompt Linkage Engine Cache',
    cacheTTL: 'Cache TTL (seconds)',
    maxCachedModules: 'Max Cached Modules',
    clearCache: 'Clear Cache',
    uiSettings: 'UI Settings',
    theme: 'Theme',
    language: 'Language',
    performanceMetrics: 'Performance Metrics',
    initialResponse: 'Initial Response',
    pleCacheHit: 'PLE Cache Hit',
    avgIFLRounds: 'Avg IFL Rounds',
    resetMetrics: 'Reset Metrics',
    improvedStoppingCriteria: 'Improved stopping criteria',
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
    addProvider: 'プロバイダー追加',
    saveProvider: '保存',
    newExecution: '新規実行',
    execute: '実行',
    emergencyStop: '緊急停止',
    resetUI: 'UI初期化',
    providerName: 'プロバイダー名',
    apiKey: 'APIキー',
    models: 'モデル',
    priority: '優先度',
    actions: '操作',
    registeredProviders: '登録済みプロバイダー',
    addNewProvider: '新規プロバイダー追加',
    moduleExported: 'モジュールをエクスポートしました',
    allModulesExported: '全モジュールをエクスポートしました',
    modulesImported: 'モジュールをインポートしました',
    importModules: 'インポート',
    exportAllModules: '全てエクスポート',
    newModule: '新規モジュール',
    pipelineInDevelopment: 'パイプライン機能は開発中です',
    saveAllChanges: '全ての変更を保存',
    systemSettings: 'システム設定',
    integratedFeedbackLoop: '統合フィードバックループポリシー',
    maximumRounds: '最大ラウンド数',
    minimumScore: '最小スコア',
    promptLinkageEngine: 'プロンプトリンケージエンジンキャッシュ',
    cacheTTL: 'キャッシュTTL（秒）',
    maxCachedModules: '最大キャッシュモジュール数',
    clearCache: 'キャッシュをクリア',
    uiSettings: 'UI設定',
    theme: 'テーマ',
    language: '言語',
    performanceMetrics: 'パフォーマンスメトリクス',
    initialResponse: '初期応答時間',
    pleCacheHit: 'PLEキャッシュヒット率',
    avgIFLRounds: '平均IFLラウンド数',
    resetMetrics: 'メトリクスをリセット',
    improvedStoppingCriteria: '停止条件の改善',
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
