/**
 * AI模型预设配置
 */
export const AI_PRESETS = {
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

/**
 * 配置管理（统一存储逻辑）
 */
export const ConfigManager = {
    // 配置键名映射
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

    // 默认值
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

    // 获取配置值
    get(category, key) {
        const storageKey = this.keys[category]?.[key];
        const defaultValue = this.defaults[category]?.[key];
        if (storageKey) {
            return GM_getValue(storageKey, defaultValue);
        }
        return defaultValue;
    },

    // 批量保存配置
    saveAll(config) {
        // 保存学习配置
        Object.keys(this.keys.learning).forEach(key => {
            if (config.learning && config.learning[key] !== undefined) {
                GM_setValue(this.keys.learning[key], config.learning[key]);
            }
        });

        // 保存答题配置
        Object.keys(this.keys.exam).forEach(key => {
            if (config.exam && config.exam[key] !== undefined) {
                GM_setValue(this.keys.exam[key], config.exam[key]);
            }
        });

        // 保存主题到localStorage
        if (config.theme) {
            localStorage.setItem('icve_theme_mode', config.theme);
        }
    },

    // 获取AI配置
    getAIConfig(aiType) {
        const preset = AI_PRESETS[aiType];
        return {
            apiKey: GM_getValue(`ai_key_${aiType}`, preset.defaultKey),
            baseURL: GM_getValue(`ai_baseurl_${aiType}`, preset.baseURL),
            model: GM_getValue(`ai_model_${aiType}`, preset.model)
        };
    }
};
