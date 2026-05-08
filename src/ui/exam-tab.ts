/**
 * 答题标签页
 */

import { CONFIG } from './config-instance';
import { AI_PRESETS } from '../utils/config';
import type { AIConfig } from '../types/index';

/**
 * 获取AI配置
 */
function getAIConfig(): AIConfig {
    const preset = AI_PRESETS[CONFIG.exam.currentAI];
    return {
        apiKey: GM_getValue<string>(`ai_key_${CONFIG.exam.currentAI}`, preset.defaultKey),
        baseURL: GM_getValue<string>(`ai_baseurl_${CONFIG.exam.currentAI}`, preset.baseURL),
        model: GM_getValue<string>(`ai_model_${CONFIG.exam.currentAI}`, preset.model)
    };
}

/**
 * 获取心流认证配置
 */
function getXinliuAuth(): { bxAuth: string; name: string } {
    return {
        bxAuth: GM_getValue<string>('xinliu_bxauth', ''),
        name: GM_getValue<string>('xinliu_name', '')
    };
}

/**
 * 检查当前是否使用心流 AI
 */
function isXinliuSelected(): boolean {
    const aiConfig = getAIConfig();
    return aiConfig.baseURL.includes('apis.iflow.cn');
}

/**
 * 创建答题标签页
 */
export function createExamTab(): string {
    let aiOptions = '';
    for (const [key, preset] of Object.entries(AI_PRESETS)) {
        const selected = CONFIG.exam.currentAI === key ? 'selected' : '';
        aiOptions += `<option value="${key}" ${selected}>${preset.name}</option>`;
    }

    const aiConfig = getAIConfig();
    const xinliuAuth = getXinliuAuth();
    const isXinliu = isXinliuSelected();

    return `
        <div class="tab-inner">
            <!-- 状态概览 -->
            <div class="exam-status-compact">
                <div class="status-line">
                    <div class="status-left">
                        <span class="status-dot" id="exam-status-dot"></span>
                        <span class="status-text" id="exam-status">就绪</span>
                    </div>
                    <div class="status-right">
                        <span class="progress-mini" id="exam-progress">0/0</span>
                    </div>
                </div>
                <div class="progress-bar-wrapper">
                    <div class="progress-bar" id="exam-progress-bar" data-progress="0%"></div>
                </div>
            </div>

            <!-- AI与密钥配置 -->
            <div class="exam-config-compact">
                <div class="config-row">
                    <label class="row-label">🔮 AI模型</label>
                    <select id="exam-ai-model" class="select-control select-mini">
                        ${aiOptions}
                    </select>
                </div>
                <!-- 非心流：显示 API Key 输入框 -->
                <div class="config-row config-key" id="api-key-row" style="display: ${isXinliu ? 'none' : 'flex'};">
                    <label class="row-label">🔑 密钥</label>
                    <input type="text" id="exam-api-key" class="input-control input-mini"
                           value="${aiConfig.apiKey}"
                           placeholder="${AI_PRESETS[CONFIG.exam.currentAI].keyPlaceholder}">
                </div>
                <!-- 心流：显示自动管理提示和认证配置 -->
                <div class="xinliu-auto-config" id="xinliu-auto-config" style="display: ${isXinliu ? 'block' : 'none'};">
                    <div class="config-row config-key">
                        <label class="row-label">🔐 BXAuth</label>
                        <input type="text" id="exam-xinliu-bxauth" class="input-control input-mini"
                               value="${xinliuAuth.bxAuth}"
                               placeholder="心流平台 Cookie">
                    </div>
                    <div class="config-row config-key">
                        <label class="row-label">👤 Name</label>
                        <input type="text" id="exam-xinliu-name" class="input-control input-mini"
                               value="${xinliuAuth.name}"
                               placeholder="如: 173****0061">
                    </div>
                    <div class="xinliu-tip" style="font-size: 11px; color: var(--text-secondary); padding: 4px 8px; background: var(--bg-secondary); border-radius: 4px; margin-top: 4px;">
                        💡 API Key 自动获取，过期自动刷新
                    </div>
                </div>
                <div class="config-row-dual">
                    <div class="config-col">
                        <label class="row-label-sm">⏱️ 延迟</label>
                        <div class="input-unit-mini">
                            <input type="number" id="exam-delay" class="input-mini-num"
                                   value="${CONFIG.exam.delay / 1000}" min="2" max="15">
                            <span class="unit-sm">秒</span>
                        </div>
                    </div>
                    <div class="config-col">
                        <label class="row-label-sm">📝 交卷</label>
                        <label class="switch-mini">
                            <input type="checkbox" id="exam-auto-submit" ${CONFIG.exam.autoSubmit ? 'checked' : ''}>
                            <span class="slider-mini"></span>
                        </label>
                    </div>
                </div>
            </div>

            <!-- 控制按钮 -->
            <div class="exam-buttons-compact">
                <button class="btn btn-primary btn-start" id="exam-start">▶️ 开始</button>
                <button class="btn btn-primary btn-stop" id="exam-stop" disabled>⏹ 停止</button>
            </div>

            <!-- 高级配置（仅非心流显示） -->
            <details class="advanced-mini" id="exam-advanced-details" style="display: ${isXinliu ? 'none' : 'block'};">
                <summary>⚙️ 高级</summary>
                <div class="advanced-body">
                    <div class="advanced-row">
                        <label>🌐 API地址</label>
                        <input type="text" id="exam-api-url" class="input-control input-mini"
                               value="${aiConfig.baseURL}"
                               placeholder="https://api.example.com/v1">
                    </div>
                    <div class="advanced-row">
                        <label>🎯 模型</label>
                        <input type="text" id="exam-api-model-name" class="input-control input-mini"
                               value="${aiConfig.model}"
                               placeholder="model-name">
                    </div>
                </div>
            </details>

            <!-- 状态提示 -->
            <div class="status-msg-mini" id="exam-message">${isXinliu ? '💡 配置 BXAuth 和 Name 后点击"开始"' : '💡 配置完成后点击"开始"'}</div>
        </div>
    `;
}
