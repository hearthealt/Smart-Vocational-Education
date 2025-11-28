import { ConfigManager } from '../utils/config.js';

/**
 * 兼容旧接口的配置对象实例
 */
export const CONFIG = {
    learning: {
        playbackRate: ConfigManager.get('learning', 'playbackRate'),
        waitTimeAfterComplete: ConfigManager.get('learning', 'waitTimeAfterComplete'),
        documentPageInterval: ConfigManager.get('learning', 'documentPageInterval'),
        expandDelay: ConfigManager.get('learning', 'expandDelay'),
        muteMedia: ConfigManager.get('learning', 'muteMedia'),
    },
    exam: {
        delay: ConfigManager.get('exam', 'delay'),
        autoSubmit: ConfigManager.get('exam', 'autoSubmit'),
        currentAI: ConfigManager.get('exam', 'currentAI'),
    },
    theme: localStorage.getItem('icve_theme_mode') || 'light',
    currentTab: 'learning',
};

/**
 * 保存配置（使用ConfigManager）
 */
export function saveConfig() {
    ConfigManager.saveAll(CONFIG);
}
