/**
 * 答题页面专属样式
 */
export const examStyles = `
/* ==================== 状态行 ==================== */
.status-line {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 8px;
}

.status-left {
    display: flex;
    align-items: center;
    gap: 8px;
}

.status-text {
    font-size: 13px;
    font-weight: 600;
    color: var(--icve-text-primary);
}

.progress-mini {
    font-size: 12px;
    font-weight: 700;
    color: var(--icve-text-secondary);
    font-family: 'JetBrains Mono', 'SF Mono', 'Consolas', monospace;
}

/* ==================== 配置区 ==================== */
.exam-config-compact {
    background: var(--icve-bg-glass);
    backdrop-filter: blur(8px);
    border-radius: 12px;
    padding: 10px;
    margin-bottom: 10px;
    border: 1px solid var(--icve-border-subtle);
    display: flex;
    flex-direction: column;
    gap: 8px;
}

.config-row {
    display: flex;
    align-items: center;
    gap: 8px;
}

.config-row.config-key {
    background: linear-gradient(135deg, rgba(16, 185, 129, 0.05), rgba(52, 211, 153, 0.05));
    padding: 6px 8px;
    border-radius: 8px;
    border: 1px solid rgba(16, 185, 129, 0.15);
}

.row-label {
    font-size: 12px;
    font-weight: 600;
    color: var(--icve-text-secondary);
    white-space: nowrap;
    min-width: 80px;
    display: inline-flex;
    align-items: center;
}

.config-row-dual {
    display: flex;
    gap: 8px;
}

.config-col {
    flex: 1;
    display: flex;
    flex-direction: column;
    gap: 4px;
}

.row-label-sm {
    font-size: 11px;
    font-weight: 600;
    color: var(--icve-text-tertiary);
    text-transform: uppercase;
    letter-spacing: 0.3px;
}

.input-unit-mini {
    display: flex;
    align-items: center;
    gap: 4px;
    background: var(--icve-bg-elevated);
    border-radius: 6px;
    padding: 4px 6px;
    border: 2px solid var(--icve-border-default);
    height: 32px;
}

.input-mini-num {
    flex: 1;
    border: none;
    background: transparent;
    padding: 0;
    font-family: 'JetBrains Mono', 'SF Mono', 'Consolas', monospace;
    font-size: 13px;
    font-weight: 600;
    outline: none;
    color: var(--icve-text-primary);
    text-align: center;
}

.unit-sm {
    font-size: 11px;
    color: var(--icve-text-tertiary);
    font-weight: 600;
}

/* 小屏幕配置区 */
@media (max-width: 480px) {
    .exam-config-compact {
        padding: 8px;
        gap: 6px;
    }

    .row-label {
        font-size: 11px;
        min-width: 60px;
    }

    .config-row-dual {
        flex-direction: column;
        gap: 6px;
    }
}

/* ==================== 按钮区 ==================== */
.exam-buttons-compact {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 8px;
    margin-bottom: 10px;
}

.exam-buttons-compact .btn {
    height: 42px;
    font-size: 14px;
}

.exam-action-buttons {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 12px;
    margin-bottom: 16px;
}

.exam-action-buttons .btn {
    height: 50px;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 8px;
}

.btn-icon {
    font-size: 16px;
    line-height: 1;
}

.btn-text {
    font-size: 15px;
    font-weight: 700;
}

/* 小屏幕按钮区 */
@media (max-width: 480px) {
    .exam-buttons-compact {
        gap: 6px;
    }

    .exam-buttons-compact .btn {
        height: 38px;
        font-size: 13px;
    }

    .exam-action-buttons {
        gap: 8px;
        margin-bottom: 12px;
    }

    .exam-action-buttons .btn {
        height: 44px;
    }
}

/* ==================== 高级配置 ==================== */
.advanced-mini {
    margin-bottom: 10px;
    border: 1px solid var(--icve-border-default);
    border-radius: 10px;
    overflow: hidden;
}

.advanced-mini summary {
    padding: 8px 12px;
    background: var(--icve-bg-sunken);
    cursor: pointer;
    font-size: 12px;
    font-weight: 600;
    color: var(--icve-text-secondary);
    user-select: none;
    list-style: none;
}

.advanced-mini summary::-webkit-details-marker {
    display: none;
}

.advanced-mini[open] {
    border-color: var(--icve-primary-via);
}

.advanced-mini summary:hover {
    background: var(--icve-bg-elevated);
    color: var(--icve-primary-via);
}

.advanced-body {
    padding: 10px;
    display: flex;
    flex-direction: column;
    gap: 8px;
    background: var(--icve-bg-glass);
}

.advanced-row {
    display: flex;
    flex-direction: column;
    gap: 6px;
}

.advanced-row label {
    font-size: 11px;
    font-weight: 600;
    color: var(--icve-text-secondary);
}

/* 高级设置详情 */
.advanced-settings {
    margin: 12px 0;
    border: 2px solid var(--icve-border-default);
    border-radius: 12px;
    overflow: hidden;
    transition: all var(--icve-duration-normal) var(--icve-ease-out-expo);
}

.advanced-settings:hover {
    border-color: var(--icve-border-default);
}

.advanced-settings[open] {
    border-color: var(--icve-primary-via);
}

.advanced-settings summary {
    padding: 12px 16px;
    background: var(--icve-bg-sunken);
    cursor: pointer;
    font-size: 13px;
    font-weight: 600;
    color: var(--icve-text-secondary);
    user-select: none;
    transition: all var(--icve-duration-normal) var(--icve-ease-out-expo);
    list-style: none;
    display: flex;
    align-items: center;
    gap: 8px;
}

.advanced-settings summary::-webkit-details-marker {
    display: none;
}

.advanced-settings summary::after {
    content: '▸';
    margin-left: auto;
    transition: transform var(--icve-duration-normal) var(--icve-ease-out-expo);
}

.advanced-settings[open] summary::after {
    transform: rotate(90deg);
}

.advanced-settings summary:hover {
    background: var(--icve-bg-elevated);
    color: var(--icve-primary-via);
}

.advanced-content {
    padding: 16px;
    display: flex;
    flex-direction: column;
    gap: 12px;
    background: var(--icve-bg-glass);
    animation: advancedSlide 0.4s var(--icve-ease-out-expo);
}

@keyframes advancedSlide {
    from {
        opacity: 0;
        transform: translateY(-8px);
    }
    to {
        opacity: 1;
        transform: translateY(0);
    }
}

.advanced-item {
    display: flex;
    flex-direction: column;
    gap: 8px;
}

.advanced-item label {
    display: flex;
    align-items: center;
    gap: 8px;
    font-size: 13px;
    font-weight: 600;
    color: var(--icve-text-secondary);
}

.label-icon {
    font-size: 16px;
    line-height: 1;
}

.hint {
    font-size: 11px;
    color: var(--icve-text-tertiary);
    margin-top: 4px;
    font-weight: 500;
    letter-spacing: 0.2px;
}

/* ==================== AI 配置相关 ==================== */
.exam-ai-selector {
    margin-bottom: 16px;
    padding: 14px;
    background: var(--icve-bg-glass);
    backdrop-filter: blur(8px);
    border-radius: 14px;
    border: 1px solid var(--icve-border-subtle);
    transition: all var(--icve-duration-normal) var(--icve-ease-out-expo);
}

.exam-ai-selector:hover {
    border-color: var(--icve-border-default);
    box-shadow: 0 4px 16px rgba(0, 0, 0, 0.06);
}

.selector-label {
    display: flex;
    align-items: center;
    gap: 8px;
    font-size: 13px;
    font-weight: 600;
    color: var(--icve-text-secondary);
    margin-bottom: 10px;
}

.exam-api-config {
    margin-bottom: 16px;
    padding: 14px;
    background: linear-gradient(135deg, rgba(16, 185, 129, 0.05), rgba(52, 211, 153, 0.05));
    backdrop-filter: blur(8px);
    border-radius: 14px;
    border: 1px solid rgba(16, 185, 129, 0.15);
    transition: all var(--icve-duration-normal) var(--icve-ease-out-expo);
}

.exam-api-config:hover {
    border-color: rgba(16, 185, 129, 0.25);
    box-shadow: 0 4px 16px rgba(16, 185, 129, 0.08);
}

.config-header {
    display: flex;
    align-items: center;
    gap: 8px;
    margin-bottom: 10px;
}

.header-icon {
    font-size: 18px;
    line-height: 1;
}

.header-label {
    flex: 1;
    font-size: 14px;
    font-weight: 700;
    color: var(--icve-text-primary);
}

.required-badge {
    padding: 3px 8px;
    background: linear-gradient(135deg, #ef4444, #f87171);
    color: white;
    font-size: 11px;
    font-weight: 700;
    border-radius: 6px;
    text-transform: uppercase;
    letter-spacing: 0.5px;
}

/* API Key 输入 */
.api-key-section {
    margin-bottom: 16px;
    padding: 16px;
    background: var(--icve-bg-glass);
    backdrop-filter: blur(8px);
    border-radius: 14px;
    border: 1px solid var(--icve-border-subtle);
}

.api-key-header {
    display: flex;
    align-items: center;
    gap: 8px;
    margin-bottom: 12px;
}

.api-icon {
    font-size: 18px;
    line-height: 1;
}

.api-label {
    font-size: 14px;
    font-weight: 700;
    color: var(--icve-text-primary);
}

.api-hint {
    margin-left: auto;
    font-size: 11px;
    color: var(--icve-text-tertiary);
}

.input-api-key {
    width: 100%;
    padding: 12px 14px;
    font-size: 14px;
    font-family: 'JetBrains Mono', 'SF Mono', 'Consolas', monospace;
    font-weight: 500;
    background: var(--icve-bg-elevated);
    border: 2px solid var(--icve-border-default);
    border-radius: 10px;
    transition: all var(--icve-duration-normal) var(--icve-ease-out-expo);
    color: var(--icve-text-primary);
}

.input-api-key:focus {
    border-color: var(--icve-primary-via);
    box-shadow: 0 0 0 4px rgba(139, 92, 246, 0.12);
    outline: none;
}

.input-api-key::placeholder {
    color: var(--icve-text-tertiary);
}

/* 小屏幕 API 配置 */
@media (max-width: 480px) {
    .exam-ai-selector,
    .exam-api-config,
    .api-key-section {
        padding: 12px;
        border-radius: 12px;
        margin-bottom: 12px;
    }

    .input-api-key {
        padding: 10px 12px;
        font-size: 13px;
    }
}

/* ==================== 设置行 ==================== */
.exam-settings-compact {
    margin-bottom: 16px;
    padding: 14px;
    background: var(--icve-bg-glass);
    backdrop-filter: blur(8px);
    border-radius: 14px;
    border: 1px solid var(--icve-border-subtle);
    display: flex;
    flex-direction: column;
    gap: 12px;
}

.setting-row {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 10px 12px;
    background: var(--icve-bg-elevated);
    border-radius: 10px;
    border: 1px solid var(--icve-border-subtle);
    transition: all var(--icve-duration-normal) var(--icve-ease-out-expo);
}

.setting-row:hover {
    border-color: var(--icve-primary-via);
    box-shadow: 0 4px 12px rgba(139, 92, 246, 0.08);
}

.setting-label-compact {
    display: flex;
    align-items: center;
    gap: 8px;
    font-size: 13px;
    font-weight: 600;
    color: var(--icve-text-primary);
}

/* AI 模型显示 */
.ai-model-display {
    display: flex;
    align-items: center;
    gap: 6px;
    padding: 6px 12px;
    background: linear-gradient(135deg, rgba(139, 92, 246, 0.1), rgba(217, 70, 239, 0.1));
    border-radius: 10px;
    border: 1px solid rgba(139, 92, 246, 0.2);
}

.model-icon {
    font-size: 16px;
    line-height: 1;
}

.model-name {
    font-size: 13px;
    font-weight: 700;
    color: var(--icve-primary-via);
}

/* 进度区域 */
.progress-section {
    background: var(--icve-bg-elevated);
    border-radius: 12px;
    padding: 12px;
    border: 1px solid var(--icve-border-subtle);
}

.progress-info {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 10px;
}

.progress-label {
    display: flex;
    align-items: center;
    gap: 6px;
    font-size: 12px;
    font-weight: 600;
    color: var(--icve-text-tertiary);
    text-transform: uppercase;
    letter-spacing: 0.5px;
}

.progress-icon {
    font-size: 16px;
    line-height: 1;
}

.progress-count {
    font-size: 14px;
    font-weight: 700;
    color: var(--icve-text-primary);
    font-family: 'JetBrains Mono', 'SF Mono', 'Consolas', monospace;
}
`;
