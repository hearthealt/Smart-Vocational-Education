/**
 * 组件样式 - 按钮、输入框、卡片等通用组件
 */
export const componentStyles = `
/* ==================== 状态卡片 ==================== */
.status-card-compact,
.learning-status-section,
.exam-status-compact {
    background: var(--icve-bg-glass);
    backdrop-filter: blur(12px);
    border-radius: 16px;
    padding: 14px 16px;
    margin-bottom: 14px;
    border: 1px solid var(--icve-border-subtle);
    box-shadow: var(--icve-shadow-ambient), inset 0 1px 0 rgba(255, 255, 255, 0.5);
    transition: all var(--icve-duration-normal) var(--icve-ease-out-expo);
    position: relative;
    overflow: hidden;
}

.status-card-compact::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 1px;
    background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.8), transparent);
}

.status-card-compact:hover {
    transform: translateY(-2px);
    box-shadow: 0 12px 32px rgba(15, 23, 42, 0.1), 0 0 32px rgba(139, 92, 246, 0.08), inset 0 1px 0 rgba(255, 255, 255, 0.5);
}

/* 小屏幕卡片调整 */
@media (max-width: 480px) {
    .status-card-compact,
    .learning-status-section,
    .exam-status-compact {
        padding: 12px;
        border-radius: 12px;
        margin-bottom: 12px;
    }
}

/* ==================== 状态行与状态项 ==================== */
.status-row {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 12px;
    gap: 10px;
    flex-wrap: wrap;
}

.status-item {
    display: flex;
    align-items: center;
    gap: 6px;
    font-size: 13px;
    font-weight: 600;
    color: var(--icve-text-primary);
}

/* 小屏幕状态行 */
@media (max-width: 480px) {
    .status-row {
        margin-bottom: 10px;
        gap: 8px;
    }

    .status-item {
        font-size: 12px;
        gap: 4px;
    }
}

/* 状态指示点 */
.status-dot {
    width: 8px;
    height: 8px;
    border-radius: 50%;
    background: #94a3b8;
    transition: all 0.3s ease;
    flex-shrink: 0;
}

.status-dot.running {
    background: #10b981;
    box-shadow: 0 0 8px rgba(16, 185, 129, 0.6);
    animation: pulse 1.5s infinite;
}

.status-dot.completed {
    background: #8b5cf6;
    box-shadow: 0 0 0 3px rgba(139, 92, 246, 0.2);
}

.status-dot.ready {
    background: #3b82f6;
    box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.2);
}

.status-dot.error {
    background: #ef4444;
    box-shadow: 0 0 0 3px rgba(239, 68, 68, 0.2);
}

@keyframes pulse {
    0%, 100% { opacity: 1; }
    50% { opacity: 0.5; }
}

/* ==================== 状态徽章 ==================== */
.status-inline {
    display: flex;
    gap: 10px;
    margin-bottom: 14px;
}

.status-badge {
    flex: 1;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 6px;
    padding: 10px 12px;
    background: var(--icve-bg-elevated);
    border-radius: 12px;
    border: 1px solid var(--icve-border-subtle);
    transition: all var(--icve-duration-normal) var(--icve-ease-spring);
    cursor: default;
}

.status-badge:hover {
    transform: translateY(-1px) scale(1.01);
    box-shadow: 0 6px 18px rgba(0, 0, 0, 0.06);
    border-color: var(--icve-primary-via);
}

.badge-icon {
    font-size: 16px;
    line-height: 1;
}

.badge-value {
    font-size: 14px;
    font-weight: 700;
    color: var(--icve-text-primary);
    font-family: 'JetBrains Mono', 'SF Mono', 'Consolas', monospace;
}

/* ==================== 进度条 ==================== */
.progress-bar-wrapper {
    height: 8px;
    background: var(--icve-bg-sunken);
    border-radius: 10px;
    overflow: visible;
    box-shadow: inset 0 2px 6px rgba(0, 0, 0, 0.08);
    margin-bottom: 14px;
    position: relative;
}

.progress-bar {
    height: 100%;
    background: linear-gradient(90deg, var(--icve-primary-from), var(--icve-primary-via), var(--icve-primary-to));
    width: 0%;
    transition: width 0.8s var(--icve-ease-out-expo);
    border-radius: 10px;
    position: relative;
    box-shadow: 0 0 20px var(--icve-primary-glow), 0 0 40px rgba(139, 92, 246, 0.2);
}

/* 进度条百分比标签 - 显示在进度条右侧外部 */
.progress-bar::before {
    content: attr(data-progress);
    position: absolute;
    right: -8px;
    top: 50%;
    transform: translate(100%, -50%);
    font-size: 11px;
    font-weight: 700;
    font-family: 'JetBrains Mono', 'SF Mono', 'Consolas', monospace;
    color: var(--icve-primary-via);
    background: var(--icve-bg-elevated);
    padding: 3px 8px;
    border-radius: 6px;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
    border: 1px solid var(--icve-border-subtle);
    white-space: nowrap;
    z-index: 10;
    opacity: 0;
    transition: opacity 0.3s ease;
}

/* 只有在有进度时才显示标签 */
.progress-bar[data-progress]:not([data-progress="0%"])::before {
    opacity: 1;
}

/* 当进度超过 70% 时，标签显示在进度条内部左侧 */
.progress-bar[style*="width: 7"],
.progress-bar[style*="width: 8"],
.progress-bar[style*="width: 9"],
.progress-bar[style*="width: 100"] {
    /* 这些选择器无法精确匹配，使用 JS 来动态添加类 */
}

/* 进度条内部标签样式（通过 JS 添加 .progress-label-inside 类） */
.progress-bar.progress-label-inside::before {
    right: auto;
    left: 8px;
    transform: translate(0, -50%);
    color: white;
    background: rgba(0, 0, 0, 0.3);
    border: none;
    backdrop-filter: blur(4px);
}

/* 进度条光效动画 */
.progress-bar::after {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: linear-gradient(90deg, transparent 0%, rgba(255, 255, 255, 0.4) 50%, transparent 100%);
    animation: progressShimmer 2s ease-in-out infinite;
    border-radius: 10px;
}

@keyframes progressShimmer {
    0% { transform: translateX(-100%); }
    100% { transform: translateX(100%); }
}

/* 小屏幕进度条标签 */
@media (max-width: 480px) {
    .progress-bar::before {
        font-size: 10px;
        padding: 2px 6px;
    }
}

/* ==================== 当前节点显示 ==================== */
.current-node {
    display: flex;
    align-items: center;
    gap: 10px;
    padding: 10px 14px;
    background: var(--icve-bg-elevated);
    border-radius: 10px;
    font-size: 12px;
    border: 1px solid var(--icve-border-subtle);
}

.node-icon {
    font-size: 16px;
    line-height: 1;
    flex-shrink: 0;
}

.node-text {
    flex: 1;
    color: var(--icve-text-secondary);
    font-weight: 600;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
}

/* ==================== 按钮系统 ==================== */
.btn {
    padding: 12px 16px;
    border: none;
    border-radius: 14px;
    cursor: pointer;
    font-family: 'Outfit', -apple-system, BlinkMacSystemFont, sans-serif;
    font-size: 14px;
    font-weight: 700;
    color: var(--icve-text-inverted);
    transition: all var(--icve-duration-normal) var(--icve-ease-spring);
    position: relative;
    overflow: hidden;
    letter-spacing: 0.3px;
}

.btn::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 50%;
    background: linear-gradient(180deg, rgba(255, 255, 255, 0.2) 0%, transparent 100%);
    pointer-events: none;
}

.btn::after {
    content: '';
    position: absolute;
    top: 50%;
    left: 50%;
    width: 0;
    height: 0;
    border-radius: 50%;
    background: rgba(255, 255, 255, 0.3);
    transform: translate(-50%, -50%);
    transition: width 0.6s ease, height 0.6s ease;
}

.btn:active::after {
    width: 400px;
    height: 400px;
}

.btn:disabled {
    opacity: 0.4;
    cursor: not-allowed;
    transform: none !important;
    filter: grayscale(0.3);
}

/* 主要按钮 */
.btn-primary {
    height: 50px;
    font-size: 15px;
}

/* 大按钮 */
.btn-large {
    width: 100%;
    padding: 14px 20px;
    font-size: 15px;
    background: linear-gradient(135deg, var(--icve-success-from) 0%, var(--icve-success-to) 100%);
    color: white !important;
    box-shadow: 0 4px 16px var(--icve-success-glow);
}

.btn-large:hover:not(:disabled) {
    transform: translateY(-2px);
    box-shadow: 0 6px 24px var(--icve-success-glow);
}

.btn-large:disabled {
    background: linear-gradient(135deg, #9ca3af, #6b7280);
    box-shadow: none;
}

/* 开始按钮 */
.btn-start {
    background: linear-gradient(135deg, var(--icve-success-from) 0%, var(--icve-success-to) 100%);
    box-shadow: 0 4px 16px var(--icve-success-glow), inset 0 1px 0 rgba(255, 255, 255, 0.2);
}

.btn-start:hover:not(:disabled) {
    transform: translateY(-2px) scale(1.01);
    box-shadow: 0 6px 24px var(--icve-success-glow), 0 0 32px rgba(16, 185, 129, 0.18), inset 0 1px 0 rgba(255, 255, 255, 0.2);
}

.btn-start:active:not(:disabled) {
    transform: translateY(0) scale(0.98);
    transition: transform 0.1s ease;
}

/* 停止按钮 */
.btn-stop {
    background: linear-gradient(135deg, var(--icve-warning-from) 0%, var(--icve-warning-to) 100%);
    box-shadow: 0 4px 16px var(--icve-warning-glow), inset 0 1px 0 rgba(255, 255, 255, 0.2);
}

.btn-stop:hover:not(:disabled) {
    transform: translateY(-2px) scale(1.01);
    box-shadow: 0 6px 24px var(--icve-warning-glow), 0 0 32px rgba(245, 158, 11, 0.18), inset 0 1px 0 rgba(255, 255, 255, 0.2);
}

.btn-stop:active:not(:disabled) {
    transform: translateY(0) scale(0.98);
    transition: transform 0.1s ease;
}

/* 次要按钮 */
.btn-secondary {
    flex: 1;
    height: 40px;
    font-size: 13px;
    font-weight: 600;
    background: linear-gradient(135deg, #64748b 0%, #475569 100%);
    box-shadow: 0 3px 12px rgba(71, 85, 105, 0.3), inset 0 1px 0 rgba(255, 255, 255, 0.15);
}

.btn-secondary:hover:not(:disabled) {
    transform: translateY(-1px);
    box-shadow: 0 4px 16px rgba(71, 85, 105, 0.3), inset 0 1px 0 rgba(255, 255, 255, 0.15);
}

/* 轮廓按钮 */
.btn-outline {
    background: var(--icve-bg-elevated) !important;
    color: #374151 !important;
    border: 1px solid var(--icve-border-subtle) !important;
}

.btn-outline:hover {
    background: var(--icve-bg-glass) !important;
    border-color: var(--icve-primary-from) !important;
}

/* 扫描按钮 */
.btn-scan {
    background: linear-gradient(135deg, var(--icve-info-from) 0%, var(--icve-info-to) 100%);
    box-shadow: 0 3px 12px var(--icve-info-glow), inset 0 1px 0 rgba(255, 255, 255, 0.15);
}

.btn-scan:hover:not(:disabled) {
    transform: translateY(-1px);
    box-shadow: 0 5px 18px var(--icve-info-glow), inset 0 1px 0 rgba(255, 255, 255, 0.15);
}

/* 重置按钮 */
.btn-reset {
    background: linear-gradient(135deg, var(--icve-primary-via) 0%, var(--icve-primary-to) 100%);
    box-shadow: 0 3px 12px var(--icve-primary-glow), inset 0 1px 0 rgba(255, 255, 255, 0.15);
}

.btn-reset:hover:not(:disabled) {
    transform: translateY(-1px);
    box-shadow: 0 5px 18px var(--icve-primary-glow), inset 0 1px 0 rgba(255, 255, 255, 0.15);
}

/* 按钮组 */
.btn-group {
    display: flex;
    gap: 8px;
}

.btn-group .btn {
    flex: 1;
    padding: 10px 12px;
    font-size: 13px;
}

.primary-actions {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 12px;
    margin-bottom: 12px;
}

.secondary-actions {
    display: flex;
    gap: 8px;
}

.control-buttons-group {
    margin-bottom: 16px;
}

/* 小屏幕按钮调整 */
@media (max-width: 480px) {
    .btn {
        padding: 10px 14px;
        font-size: 13px;
        border-radius: 12px;
    }

    .btn-primary {
        height: 44px;
        font-size: 14px;
    }

    .btn-large {
        padding: 12px 16px;
        font-size: 14px;
    }

    .btn-group {
        gap: 6px;
    }

    .btn-group .btn {
        padding: 8px 10px;
        font-size: 12px;
    }

    .primary-actions {
        gap: 10px;
    }
}

/* 切换按钮标签 */
.btn-toggle-label {
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 4px;
    color: #374151 !important;
}

.btn-toggle-label:has(input:checked) {
    background: linear-gradient(135deg, var(--icve-primary-from), var(--icve-primary-to)) !important;
    color: white !important;
    border-color: transparent !important;
}

/* 切换按钮 */
.btn-toggle {
    flex: 1;
    height: 40px;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 6px;
    background: var(--icve-bg-elevated);
    border-radius: 12px;
    cursor: pointer;
    transition: all var(--icve-duration-normal) var(--icve-ease-spring);
    font-size: 13px;
    font-weight: 600;
    color: var(--icve-text-secondary);
    border: 2px solid var(--icve-border-default);
    padding: 0 12px;
}

.btn-toggle:hover {
    border-color: var(--icve-primary-via);
    color: var(--icve-primary-via);
    box-shadow: 0 3px 12px rgba(139, 92, 246, 0.12);
    transform: translateY(-1px);
}

.btn-toggle:active {
    transform: translateY(0);
    transition: transform 0.1s ease;
}

.btn-toggle input[type="checkbox"] {
    display: none;
}

.toggle-icon {
    font-size: 16px;
    transition: transform var(--icve-duration-normal) var(--icve-ease-spring);
}

.btn-toggle:hover .toggle-icon {
    transform: scale(1.2);
}

.toggle-text {
    font-size: 13px;
}

/* ==================== 输入框与选择器 ==================== */
.select-control, .input-control {
    width: 100%;
    padding: 10px 12px;
    border: 2px solid var(--icve-border-default);
    border-radius: 10px;
    background: var(--icve-bg-elevated);
    color: var(--icve-text-primary);
    font-family: 'Outfit', -apple-system, BlinkMacSystemFont, sans-serif;
    font-size: 14px;
    font-weight: 500;
    outline: none;
    transition: all var(--icve-duration-normal) var(--icve-ease-out-expo);
    cursor: pointer;
}

.select-control:hover, .input-control:hover {
    border-color: var(--icve-border-default);
    background: var(--icve-bg-sunken);
}

.select-control:focus, .input-control:focus {
    border-color: var(--icve-primary-via);
    background: var(--icve-bg-elevated);
    box-shadow: 0 0 0 4px rgba(139, 92, 246, 0.1);
}

/* 带单位输入框 */
.input-with-unit {
    display: flex;
    align-items: center;
    background: var(--icve-bg-elevated);
    border-radius: 10px;
    padding: 4px 4px 4px 12px;
    border: 2px solid var(--icve-border-default);
    transition: all var(--icve-duration-normal) var(--icve-ease-out-expo);
}

.input-with-unit:focus-within {
    border-color: var(--icve-primary-via);
    box-shadow: 0 0 0 4px rgba(139, 92, 246, 0.1);
}

.input-with-unit input {
    flex: 1;
    border: none;
    background: transparent;
    padding: 8px 4px;
    font-family: 'JetBrains Mono', 'SF Mono', 'Consolas', monospace;
    font-size: 14px;
    font-weight: 600;
    color: var(--icve-text-primary);
    outline: none;
}

.input-with-unit .unit {
    font-size: 12px;
    font-weight: 600;
    color: var(--icve-text-tertiary);
    padding: 0 10px;
    white-space: nowrap;
}

/* 迷你输入框 */
.select-mini, .input-mini {
    flex: 1;
    height: 32px;
    padding: 4px 8px;
    font-size: 13px;
    border-radius: 8px;
}

.select-mini {
    font-weight: 600;
    color: var(--icve-primary-via);
}

.input-mini {
    font-family: 'JetBrains Mono', 'SF Mono', 'Consolas', monospace;
}

/* 小屏幕输入框 */
@media (max-width: 480px) {
    .select-control, .input-control {
        padding: 8px 10px;
        font-size: 13px;
    }

    .input-with-unit {
        padding: 2px 2px 2px 10px;
    }

    .input-with-unit input {
        padding: 6px 4px;
        font-size: 13px;
    }
}

/* ==================== 设置区域 ==================== */
.settings-section {
    margin-bottom: 16px;
    padding: 16px;
    border-radius: 16px;
    background: var(--icve-bg-glass);
    backdrop-filter: blur(8px);
    border: 1px solid var(--icve-border-subtle);
    transition: all var(--icve-duration-normal) var(--icve-ease-out-expo);
    box-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.4);
}

.settings-section:hover {
    box-shadow: 0 8px 24px rgba(0, 0, 0, 0.06), inset 0 1px 0 rgba(255, 255, 255, 0.4);
    border-color: var(--icve-border-default);
}

.settings-section:last-child {
    margin-bottom: 0;
}

.section-header h3 {
    margin: 0 0 12px 0;
    font-size: 14px;
    font-weight: 700;
    color: var(--icve-text-primary);
    letter-spacing: 0.3px;
    display: flex;
    align-items: center;
    gap: 8px;
}

.settings-grid, .settings-grid-compact {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 14px;
}

.setting-item {
    display: flex;
    flex-direction: column;
    gap: 8px;
}

.setting-label {
    font-size: 12px;
    font-weight: 600;
    color: var(--icve-text-tertiary);
    letter-spacing: 0.3px;
    text-transform: uppercase;
}

/* 小屏幕设置区域 */
@media (max-width: 480px) {
    .settings-section {
        padding: 12px;
        border-radius: 12px;
        margin-bottom: 12px;
    }

    .section-header h3 {
        font-size: 13px;
        margin-bottom: 10px;
    }

    .settings-grid, .settings-grid-compact {
        gap: 10px;
    }

    .setting-label {
        font-size: 11px;
    }
}

/* 单列设置布局（超小屏幕） */
@media (max-width: 360px) {
    .settings-grid, .settings-grid-compact {
        grid-template-columns: 1fr;
    }
}

/* ==================== 状态消息 ==================== */
.status-message, .status-msg-mini {
    padding: 12px 16px;
    background: var(--icve-bg-glass);
    backdrop-filter: blur(8px);
    border-radius: 12px;
    font-size: 13px;
    color: var(--icve-text-secondary);
    text-align: center;
    border: 1px solid var(--icve-border-subtle);
    transition: all var(--icve-duration-normal) var(--icve-ease-out-expo);
    font-weight: 500;
}

.status-message:hover {
    border-color: var(--icve-border-default);
    box-shadow: 0 4px 16px rgba(0, 0, 0, 0.05);
}

.status-msg-mini {
    padding: 8px 10px;
    border-radius: 8px;
    font-size: 12px;
}

/* 小屏幕状态消息 */
@media (max-width: 480px) {
    .status-message {
        padding: 10px 12px;
        font-size: 12px;
        border-radius: 10px;
    }

    .status-msg-mini {
        padding: 6px 8px;
        font-size: 11px;
    }
}

/* ==================== 开关切换 ==================== */
.switch-toggle {
    position: relative;
    display: inline-block;
    width: 48px;
    height: 26px;
}

.switch-toggle input[type="checkbox"] {
    opacity: 0;
    width: 0;
    height: 0;
}

.switch-slider {
    position: absolute;
    cursor: pointer;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: #cbd5e1;
    border-radius: 26px;
    transition: all var(--icve-duration-normal) var(--icve-ease-out-expo);
}

.switch-slider::before {
    content: '';
    position: absolute;
    height: 20px;
    width: 20px;
    left: 3px;
    bottom: 3px;
    background: white;
    border-radius: 50%;
    transition: all var(--icve-duration-normal) var(--icve-ease-spring);
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
}

.switch-toggle input:checked + .switch-slider {
    background: linear-gradient(135deg, var(--icve-primary-from), var(--icve-primary-to));
}

.switch-toggle input:checked + .switch-slider::before {
    transform: translateX(22px);
}

.switch-toggle:hover .switch-slider {
    box-shadow: 0 0 8px rgba(139, 92, 246, 0.3);
}

/* 迷你开关 */
.switch-mini {
    position: relative;
    display: inline-block;
    width: 42px;
    height: 24px;
}

.switch-mini input[type="checkbox"] {
    opacity: 0;
    width: 0;
    height: 0;
}

.slider-mini {
    position: absolute;
    cursor: pointer;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: #cbd5e1;
    border-radius: 24px;
    transition: all 0.3s;
}

.slider-mini::before {
    content: '';
    position: absolute;
    height: 18px;
    width: 18px;
    left: 3px;
    bottom: 3px;
    background: white;
    border-radius: 50%;
    transition: all 0.3s;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
}

.switch-mini input:checked + .slider-mini {
    background: linear-gradient(135deg, var(--icve-primary-from), var(--icve-primary-to));
}

.switch-mini input:checked + .slider-mini::before {
    transform: translateX(18px);
}
`;
