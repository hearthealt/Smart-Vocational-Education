/**
 * 兼容旧版样式（保留必要的旧选择器以确保兼容性）
 */
export const legacyStyles = `
/* ==================== 兼容旧样式 ==================== */
.status-card {
    background: var(--icve-bg-glass);
    backdrop-filter: blur(12px);
    border-radius: 18px;
    padding: 16px;
    margin-bottom: 16px;
    border: 1px solid var(--icve-border-subtle);
    box-shadow: var(--icve-shadow-ambient);
}

.status-row:last-child {
    margin-bottom: 0;
}

.label {
    color: var(--icve-text-tertiary);
    font-weight: 600;
}

.value {
    font-weight: 700;
    font-size: 14px;
    color: var(--icve-text-primary);
    font-family: 'JetBrains Mono', 'SF Mono', 'Consolas', monospace;
}

.value.short {
    max-width: 130px;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
}

.control-buttons {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    gap: 10px;
    margin-bottom: 16px;
}

.switches {
    display: flex;
    flex-direction: column;
    gap: 8px;
}

.switch-item {
    display: flex;
    align-items: center;
    padding: 12px 14px;
    background: var(--icve-bg-elevated);
    border: 2px solid var(--icve-border-default);
    border-radius: 12px;
    cursor: pointer;
    transition: all var(--icve-duration-normal) var(--icve-ease-spring);
}

.switch-item:hover {
    border-color: var(--icve-primary-via);
    transform: translateX(4px);
    box-shadow: 0 4px 16px rgba(139, 92, 246, 0.15);
}

.switch-item input[type="checkbox"] {
    margin-right: 10px;
    width: 18px;
    height: 18px;
    cursor: pointer;
    accent-color: var(--icve-primary-via);
}

.switch-label {
    font-size: 14px;
    font-weight: 600;
    color: var(--icve-text-primary);
}

.setting-row-full {
    display: flex;
    flex-direction: column;
    gap: 8px;
    grid-column: span 2;
}

.setting-row label, .setting-row-full label {
    font-size: 12px;
    font-weight: 600;
    color: var(--icve-text-tertiary);
    text-transform: uppercase;
    letter-spacing: 0.3px;
}

.hint-info {
    color: var(--icve-info-from);
}

.hint-box {
    padding: 12px 14px;
    background: linear-gradient(135deg, #fef3c7 0%, #fde68a 100%);
    border: 2px solid #fcd34d;
    border-radius: 12px;
    font-size: 13px;
    color: #92400e;
    margin-top: 8px;
    font-weight: 500;
    box-shadow: 0 4px 12px rgba(252, 211, 77, 0.25);
}

.ai-model-selector,
.api-key-input,
.exam-delay-setting {
    margin-bottom: 12px;
}

.model-label {
    display: flex;
    align-items: center;
    gap: 8px;
    font-size: 13px;
    font-weight: 600;
    color: var(--icve-text-primary);
    margin-bottom: 8px;
}

.select-large, .input-large {
    font-size: 14px;
    padding: 12px 14px;
}

.select-large {
    font-weight: 600;
    color: var(--icve-primary-via);
}

.input-large {
    font-family: 'JetBrains Mono', 'SF Mono', 'Consolas', monospace;
}

.input-with-suffix {
    display: flex;
    align-items: center;
    gap: 10px;
}

.input-with-suffix .input-control {
    flex: 1;
    min-width: 0;
}

.input-suffix {
    font-size: 13px;
    font-weight: 600;
    color: var(--icve-text-tertiary);
    white-space: nowrap;
}

.question-bank-stats {
    margin-top: 16px;
    padding: 14px 16px;
    background: var(--icve-bg-glass);
    border-radius: 12px;
    border: 1px solid var(--icve-border-subtle);
}

.stats-row {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 6px 0;
    font-size: 13px;
}

.stats-label {
    color: var(--icve-text-secondary);
    font-weight: 600;
}

.stats-value {
    color: var(--icve-primary-via);
    font-weight: 700;
    font-size: 14px;
    font-family: 'JetBrains Mono', 'SF Mono', 'Consolas', monospace;
}

/* 快速配置（答题页旧样式兼容） */
.quick-config {
    display: flex;
    gap: 10px;
    margin-bottom: 16px;
    padding: 14px;
    background: var(--icve-bg-glass);
    backdrop-filter: blur(8px);
    border-radius: 14px;
    border: 1px solid var(--icve-border-subtle);
    flex-wrap: wrap;
}

.config-item {
    flex: 1;
    display: flex;
    align-items: center;
    gap: 8px;
    min-width: 100px;
}

.config-item.config-ai {
    flex: 1.6;
    min-width: 0;
}

.config-item.config-delay {
    flex: 1.4;
    min-width: 0;
}

.config-item.config-submit {
    flex: 1;
    min-width: 0;
}

.config-label {
    font-size: 18px;
    line-height: 1;
}

.select-compact, .input-compact {
    flex: 1;
    min-width: 0;
    height: 36px;
    padding: 6px 10px;
    font-size: 13px;
    border-radius: 8px;
}

.config-ai .select-compact {
    font-weight: 700;
    color: var(--icve-primary-via);
}

.config-delay .input-compact {
    text-align: center;
    font-weight: 600;
    font-family: 'JetBrains Mono', 'SF Mono', 'Consolas', monospace;
}

.input-with-unit-inline {
    flex: 1;
    display: flex;
    align-items: center;
    gap: 4px;
    background: var(--icve-bg-elevated);
    border-radius: 8px;
    padding: 4px 8px;
    border: 2px solid var(--icve-border-default);
}

.input-with-unit-inline input {
    flex: 1;
    border: none;
    background: transparent;
    padding: 4px;
    font-family: 'JetBrains Mono', 'SF Mono', 'Consolas', monospace;
    font-size: 13px;
    font-weight: 600;
    outline: none;
    color: var(--icve-text-primary);
}

.input-with-unit-inline .unit {
    font-size: 11px;
    color: var(--icve-text-tertiary);
    font-weight: 600;
}

.switch-item-inline {
    display: flex;
    align-items: center;
    gap: 6px;
    cursor: pointer;
}

.switch-item-inline input[type="checkbox"] {
    width: 18px;
    height: 18px;
    cursor: pointer;
    accent-color: var(--icve-primary-via);
}

.switch-label-inline {
    font-size: 13px;
    font-weight: 600;
    color: var(--icve-text-secondary);
    cursor: pointer;
    white-space: nowrap;
}

/* 状态概览（兼容旧版） */
.exam-status-overview {
    background: var(--icve-bg-glass);
    backdrop-filter: blur(12px);
    border-radius: 16px;
    padding: 16px;
    margin-bottom: 16px;
    border: 1px solid var(--icve-border-subtle);
    box-shadow: var(--icve-shadow-ambient);
    transition: all var(--icve-duration-normal) var(--icve-ease-out-expo);
}

.exam-status-overview:hover {
    box-shadow: 0 12px 32px rgba(15, 23, 42, 0.1);
    border-color: var(--icve-border-default);
}

.status-header-row {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 14px;
}

.status-indicator {
    display: flex;
    align-items: center;
    gap: 10px;
}

.summary-icon {
    font-size: 16px;
    line-height: 1;
}

.summary-badge {
    margin-left: auto;
    padding: 3px 8px;
    background: rgba(139, 92, 246, 0.1);
    color: var(--icve-primary-via);
    font-size: 11px;
    font-weight: 700;
    border-radius: 6px;
    text-transform: uppercase;
    letter-spacing: 0.5px;
}

.message-icon {
    font-size: 16px;
    line-height: 1;
    margin-right: 6px;
}

/* 小屏幕兼容样式 */
@media (max-width: 480px) {
    .quick-config {
        padding: 10px;
        gap: 8px;
    }

    .config-item {
        min-width: 80px;
    }

    .select-compact, .input-compact {
        height: 32px;
        font-size: 12px;
    }
}

@media (max-width: 360px) {
    .quick-config {
        flex-direction: column;
    }

    .config-item {
        width: 100%;
    }
}
`;
