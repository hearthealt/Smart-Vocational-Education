/**
 * 配置管理实例
 */

import { ConfigManager } from '../utils/config';
import type { LearningConfig, ExamConfig, AppConfig } from '../types/index';

interface Config extends Partial<AppConfig> {
    learning: LearningConfig;
    exam: ExamConfig;
    theme: 'light' | 'dark';
    currentTab: string;
}

/**
 * 兼容旧接口的配置对象实例
 */
export const CONFIG: Config = {
    learning: {
        playbackRate: ConfigManager.get<number>('learning', 'playbackRate'),
        waitTimeAfterComplete: ConfigManager.get<number>('learning', 'waitTimeAfterComplete'),
        documentPageInterval: ConfigManager.get<number>('learning', 'documentPageInterval'),
        expandDelay: ConfigManager.get<number>('learning', 'expandDelay'),
        muteMedia: ConfigManager.get<boolean>('learning', 'muteMedia'),
    },
    exam: {
        delay: ConfigManager.get<number>('exam', 'delay'),
        autoSubmit: ConfigManager.get<boolean>('exam', 'autoSubmit'),
        currentAI: ConfigManager.get<string>('exam', 'currentAI'),
    },
    theme: (localStorage.getItem('icve_theme_mode') as 'light' | 'dark') || 'light',
    currentTab: 'learning',
};

/**
 * 保存配置（使用ConfigManager）
 */
export function saveConfig(): void {
    ConfigManager.saveAll(CONFIG);
}
