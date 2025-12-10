/**
 * 配置管理模块
 */

import type { AIPreset, AIConfig, LearningConfig, ExamConfig, AppConfig } from '../types/index';

/**
 * AI模型预设配置
 */
export const AI_PRESETS: Record<string, AIPreset> = {
    xinliu: {
        name: '心流',
        baseURL: 'https://apis.iflow.cn/v1',
        model: 'qwen3-max',
        defaultKey: '',
        keyPlaceholder: 'sk-xxx'
    },
    openai: {
        name: 'OpenAI',
        baseURL: 'https://api.openai.com/v1',
        model: 'gpt-4o-mini',
        defaultKey: '',
        keyPlaceholder: 'sk-xxx'
    },
    claude: {
        name: 'Claude',
        baseURL: 'https://api.anthropic.com/v1',
        model: 'claude-3-5-sonnet-20241022',
        defaultKey: '',
        keyPlaceholder: 'sk-ant-xxx'
    },
    gemini: {
        name: 'Google Gemini',
        baseURL: 'https://generativelanguage.googleapis.com/v1beta',
        model: 'gemini-2.0-flash-exp',
        defaultKey: '',
        keyPlaceholder: 'AIzaSyxxx'
    },
    deepseek: {
        name: 'DeepSeek',
        baseURL: 'https://api.deepseek.com/v1',
        model: 'deepseek-chat',
        defaultKey: '',
        keyPlaceholder: 'sk-xxx'
    },
    custom: {
        name: '自定义',
        baseURL: '',
        model: '',
        defaultKey: '',
        keyPlaceholder: 'your-api-key'
    }
};

interface ConfigKeys {
    learning: Record<keyof LearningConfig, string>;
    exam: Record<keyof ExamConfig, string>;
    progress: {
        processedNodes: string;
        completedChapters: string;
    };
}

interface ConfigDefaults {
    learning: LearningConfig;
    exam: ExamConfig;
}

interface ConfigManagerInterface {
    keys: ConfigKeys;
    defaults: ConfigDefaults;
    get<T>(category: 'learning' | 'exam', key: string): T;
    saveAll(config: Partial<AppConfig>): void;
    getAIConfig(aiType: string): AIConfig;
}

/**
 * 配置管理（统一存储逻辑）
 */
export const ConfigManager: ConfigManagerInterface = {
    keys: {
        learning: {
            playbackRate: 'learning_playbackRate',
            waitTimeAfterComplete: 'learning_waitTime',
            documentPageInterval: 'learning_docInterval',
            expandDelay: 'learning_expandDelay',
            muteMedia: 'learning_muteMedia'
        },
        exam: {
            delay: 'exam_delay',
            autoSubmit: 'exam_autoSubmit',
            currentAI: 'exam_currentAI'
        },
        progress: {
            processedNodes: 'learning_processedNodes',
            completedChapters: 'learning_completedChapters'
        }
    },

    defaults: {
        learning: {
            playbackRate: 1.0,
            waitTimeAfterComplete: 2,
            documentPageInterval: 1,
            expandDelay: 3,
            muteMedia: false
        },
        exam: {
            delay: 3000,
            autoSubmit: false,
            currentAI: 'xinliu'
        }
    },

    get<T>(category: 'learning' | 'exam', key: string): T {
        const categoryKeys = this.keys[category] as Record<string, string>;
        const categoryDefaults = this.defaults[category] as unknown as Record<string, unknown>;
        const storageKey = categoryKeys?.[key];
        const defaultValue = categoryDefaults?.[key] as T;

        if (storageKey) {
            return GM_getValue<T>(storageKey, defaultValue);
        }
        return defaultValue;
    },

    saveAll(config: Partial<AppConfig>): void {
        // 保存学习配置
        if (config.learning) {
            const learningKeys = this.keys.learning as Record<string, string>;
            Object.keys(learningKeys).forEach(key => {
                const value = (config.learning as unknown as Record<string, unknown>)?.[key];
                if (value !== undefined) {
                    GM_setValue(learningKeys[key], value);
                }
            });
        }

        // 保存答题配置
        if (config.exam) {
            const examKeys = this.keys.exam as Record<string, string>;
            Object.keys(examKeys).forEach(key => {
                const value = (config.exam as unknown as Record<string, unknown>)?.[key];
                if (value !== undefined) {
                    GM_setValue(examKeys[key], value);
                }
            });
        }

        // 保存主题到localStorage
        if (config.theme) {
            localStorage.setItem('icve_theme_mode', config.theme);
        }
    },

    getAIConfig(aiType: string): AIConfig {
        const preset = AI_PRESETS[aiType] || AI_PRESETS.custom;
        return {
            apiKey: GM_getValue<string>(`ai_key_${aiType}`, preset.defaultKey),
            baseURL: GM_getValue<string>(`ai_baseurl_${aiType}`, preset.baseURL),
            model: GM_getValue<string>(`ai_model_${aiType}`, preset.model)
        };
    }
};

export default ConfigManager;
