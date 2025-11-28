import { CONFIG } from './config-instance.js';
import { AI_PRESETS } from '../utils/config.js';

/**
 * 获取AI配置
 */
function getAIConfig() {
    const preset = AI_PRESETS[CONFIG.exam.currentAI];
    return {
        apiKey: GM_getValue(`ai_key_${CONFIG.exam.currentAI}`, preset.defaultKey),
        baseURL: GM_getValue(`ai_baseurl_${CONFIG.exam.currentAI}`, preset.baseURL),
        model: GM_getValue(`ai_model_${CONFIG.exam.currentAI}`, preset.model)
    };
}

/**
 * 创建答题标签页
 */
export function createExamTab() {
    let aiOptions = '';
    for (const [key, preset] of Object.entries(AI_PRESETS)) {
        const selected = CONFIG.exam.currentAI === key ? 'selected' : '';
        aiOptions += `<option value="${key}" ${selected}>${preset.name}</option>`;
    }

    const aiConfig = getAIConfig();

    return `
        <div class="tab-inner">
            <!-- 状态卡片 - 紧凑型 -->
            <div class="status-card-compact">
                <div class="status-inline">
                    <span class="status-badge">
                        <span class="badge-icon">🎯</span>
                        <span class="badge-value" id="exam-status">就绪</span>
                    </span>
                    <span class="status-badge">
                        <span class="badge-icon">📊</span>
                        <span class="badge-value" id="exam-progress">0/0</span>
                    </span>
                    <span class="status-badge">
                        <span class="badge-icon">🤖</span>
                        <span class="badge-value">${AI_PRESETS[CONFIG.exam.currentAI].name}</span>
                    </span>
                </div>
                <div class="progress-bar-wrapper">
                    <div class="progress-bar" id="exam-progress-bar" data-progress="0%"></div>
                </div>
            </div>

            <!-- 快速配置栏 -->
            <div class="quick-config">
                <div class="config-item config-ai">
                    <label class="config-label">🔮</label>
                    <select id="exam-ai-model" class="select-control select-compact">
                        ${aiOptions}
                    </select>
                </div>
                <div class="config-item config-delay">
                    <label class="config-label">⏱️</label>
                    <div class="input-with-unit-inline">
                        <input type="number" id="exam-delay" class="input-control input-compact"
                               value="${CONFIG.exam.delay / 1000}" min="2" max="15">
                        <span class="unit">秒</span>
                    </div>
                </div>
                <div class="config-item config-submit">
                    <label class="switch-item-inline">
                        <input type="checkbox" id="exam-auto-submit" ${CONFIG.exam.autoSubmit ? 'checked' : ''}>
                        <span class="switch-label-inline">自动交卷</span>
                    </label>
                </div>
            </div>

            <!-- API密钥输入 -->
            <div class="api-key-section">
                <div class="api-key-header">
                    <span class="api-icon">🔑</span>
                    <span class="api-label">API Key</span>
                    <small class="api-hint">需要密钥才能使用AI答题</small>
                </div>
                <input type="text" id="exam-api-key" class="input-control input-api-key"
                       value="${aiConfig.apiKey}"
                       placeholder="${AI_PRESETS[CONFIG.exam.currentAI].keyPlaceholder}">
            </div>

            <!-- 控制按钮 -->
            <div class="control-buttons-group">
                <div class="primary-actions">
                    <button class="btn btn-primary btn-start" id="exam-start">▶️ 开始答题</button>
                    <button class="btn btn-primary btn-stop" id="exam-stop" disabled>⏹ 停止答题</button>
                </div>
            </div>

            <!-- 高级配置 -->
            <details class="advanced-settings">
                <summary>⚙️ 高级配置（可选）</summary>
                <div class="advanced-content">
                    <div class="advanced-item">
                        <label>
                            <span class="label-icon">🌐</span>
                            <span>API 地址</span>
                        </label>
                        <input type="text" id="exam-api-url" class="input-control"
                               value="${aiConfig.baseURL}"
                               placeholder="https://api.example.com/v1">
                        <small class="hint">默认使用官方地址，如需使用代理可修改</small>
                    </div>
                    <div class="advanced-item">
                        <label>
                            <span class="label-icon">🎯</span>
                            <span>模型名称</span>
                        </label>
                        <input type="text" id="exam-api-model-name" class="input-control"
                               value="${aiConfig.model}"
                               placeholder="gpt-4">
                        <small class="hint">默认使用推荐模型，高级用户可自定义</small>
                    </div>
                </div>
            </details>

            <!-- 状态消息 -->
            <div class="status-message" id="exam-message">
                💡 配置完成后点击"开始答题"
            </div>
        </div>
    `;
}
