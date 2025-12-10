/**
 * 配置导入导出模块
 */

import { CONFIG, saveConfig } from './config-instance';
import { ConfigManager, AI_PRESETS } from '../utils/config';
import { Logger } from '../utils/logger';

interface ExportedConfig {
    version: string;
    exportedAt: number;
    learning: typeof CONFIG.learning;
    exam: Omit<typeof CONFIG.exam, 'currentAI'> & { currentAI: string };
    theme: typeof CONFIG.theme;
    aiConfigs: Record<string, {
        apiKey: string;
        baseURL: string;
        model: string;
    }>;
}

const CONFIG_VERSION = '1.0';

/**
 * 导出配置为 JSON
 */
export function exportConfig(): string {
    const aiConfigs: ExportedConfig['aiConfigs'] = {};

    // 导出所有 AI 配置
    Object.keys(AI_PRESETS).forEach(aiType => {
        aiConfigs[aiType] = ConfigManager.getAIConfig(aiType);
    });

    const exportData: ExportedConfig = {
        version: CONFIG_VERSION,
        exportedAt: Date.now(),
        learning: { ...CONFIG.learning },
        exam: { ...CONFIG.exam },
        theme: CONFIG.theme,
        aiConfigs
    };

    return JSON.stringify(exportData, null, 2);
}

/**
 * 下载配置文件
 */
export function downloadConfig(): void {
    const configJson = exportConfig();
    const blob = new Blob([configJson], { type: 'application/json' });
    const url = URL.createObjectURL(blob);

    const a = document.createElement('a');
    a.href = url;
    a.download = `icve-helper-config-${new Date().toISOString().slice(0, 10)}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);

    Logger.success('配置已导出');
}

/**
 * 导入配置
 */
export function importConfig(jsonString: string): { success: boolean; message: string } {
    try {
        const data = JSON.parse(jsonString) as ExportedConfig;

        // 验证版本
        if (!data.version) {
            return { success: false, message: '无效的配置文件格式' };
        }

        // 导入学习配置
        if (data.learning) {
            Object.assign(CONFIG.learning, data.learning);
        }

        // 导入答题配置
        if (data.exam) {
            Object.assign(CONFIG.exam, data.exam);
        }

        // 导入主题
        if (data.theme) {
            CONFIG.theme = data.theme;
        }

        // 导入 AI 配置
        if (data.aiConfigs) {
            Object.entries(data.aiConfigs).forEach(([aiType, config]) => {
                if (config.apiKey) {
                    GM_setValue(`ai_key_${aiType}`, config.apiKey);
                }
                if (config.baseURL) {
                    GM_setValue(`ai_baseurl_${aiType}`, config.baseURL);
                }
                if (config.model) {
                    GM_setValue(`ai_model_${aiType}`, config.model);
                }
            });
        }

        // 保存配置
        saveConfig();

        Logger.success('配置导入成功');
        return { success: true, message: '配置导入成功，页面将刷新以应用更改' };
    } catch (error) {
        Logger.error('配置导入失败:', error);
        return { success: false, message: '配置文件解析失败，请检查文件格式' };
    }
}

/**
 * 重置为默认配置
 */
export function resetToDefault(): void {
    // 重置学习配置
    CONFIG.learning = { ...ConfigManager.defaults.learning };

    // 重置答题配置
    CONFIG.exam = { ...ConfigManager.defaults.exam };

    // 重置主题
    CONFIG.theme = 'light';

    // 保存配置
    saveConfig();

    // 清除 AI 配置
    Object.keys(AI_PRESETS).forEach(aiType => {
        GM_setValue(`ai_key_${aiType}`, '');
        GM_setValue(`ai_baseurl_${aiType}`, AI_PRESETS[aiType].baseURL);
        GM_setValue(`ai_model_${aiType}`, AI_PRESETS[aiType].model);
    });

    Logger.warn('配置已重置为默认值');
}

/**
 * 创建配置文件选择器
 */
export function createFileInput(onImport: (result: { success: boolean; message: string }) => void): HTMLInputElement {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = '.json';
    input.style.display = 'none';

    input.addEventListener('change', (e) => {
        const file = (e.target as HTMLInputElement).files?.[0];
        if (!file) return;

        const reader = new FileReader();
        reader.onload = (event) => {
            const content = event.target?.result as string;
            const result = importConfig(content);
            onImport(result);
        };
        reader.readAsText(file);
    });

    return input;
}

/**
 * 创建配置管理面板 HTML
 */
export function createConfigManagementSection(): string {
    return `
        <details class="config-management-details" id="config-management-details">
            <summary>🔧 配置管理</summary>
            <div class="config-management-body">
                <div class="config-action-row">
                    <button class="btn btn-outline btn-sm" id="export-config" title="导出当前配置">
                        📤 导出配置
                    </button>
                    <button class="btn btn-outline btn-sm" id="import-config" title="导入配置文件">
                        📥 导入配置
                    </button>
                </div>
                <div class="config-action-row">
                    <button class="btn btn-outline btn-sm btn-danger" id="reset-config" title="重置为默认配置">
                        🔄 恢复默认
                    </button>
                    <button class="btn btn-outline btn-sm" id="show-guide" title="显示使用指南">
                        ❓ 使用指南
                    </button>
                </div>
            </div>
        </details>
    `;
}

/**
 * 获取配置管理样式
 */
export function getConfigManagementStyles(): string {
    return `
        /* 配置管理区域 */
        .config-management-details {
            margin-top: 12px;
            border: 1px solid var(--border-color);
            border-radius: 6px;
            overflow: hidden;
        }

        .config-management-details summary {
            padding: 8px 12px;
            background: var(--bg-secondary);
            cursor: pointer;
            font-size: 13px;
            font-weight: 500;
            color: var(--text-secondary);
            transition: background 0.2s;
        }

        .config-management-details summary:hover {
            background: var(--bg-hover);
        }

        .config-management-details[open] summary {
            border-bottom: 1px solid var(--border-color);
        }

        .config-management-body {
            padding: 12px;
            display: flex;
            flex-direction: column;
            gap: 8px;
        }

        .config-action-row {
            display: flex;
            gap: 8px;
        }

        .config-action-row .btn {
            flex: 1;
        }

        .btn-danger {
            color: #ef4444 !important;
            border-color: #fca5a5 !important;
        }

        .btn-danger:hover {
            background: #fef2f2 !important;
        }

        .dark-theme .btn-danger:hover {
            background: rgba(239, 68, 68, 0.1) !important;
        }
    `;
}
