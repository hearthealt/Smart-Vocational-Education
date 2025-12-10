/**
 * 深色主题样式
 */
export const darkThemeStyles = `
/* ==================== 深色主题 ==================== */
#icve-tabbed-panel.dark-theme {
    --icve-bg-base: #0f172a;
    --icve-bg-elevated: #1e293b;
    --icve-bg-sunken: #0c1322;
    --icve-bg-glass: rgba(30, 41, 59, 0.8);
    --icve-bg-glass-strong: rgba(30, 41, 59, 0.92);
    --icve-border-subtle: rgba(148, 163, 184, 0.12);
    --icve-border-default: rgba(148, 163, 184, 0.2);
    --icve-text-primary: #f1f5f9;
    --icve-text-secondary: #94a3b8;
    --icve-text-tertiary: #64748b;
    --icve-shadow-ambient: 0 8px 32px rgba(0, 0, 0, 0.3);
    --icve-shadow-elevated: 0 24px 48px rgba(0, 0, 0, 0.4);
    --icve-shadow-glow: 0 0 60px rgba(139, 92, 246, 0.25);
}

#icve-tabbed-panel.dark-theme .panel-container {
    box-shadow:
        var(--icve-shadow-elevated),
        var(--icve-shadow-glow),
        inset 0 1px 1px rgba(255, 255, 255, 0.08);
}

#icve-tabbed-panel.dark-theme .panel-container::before {
    background: radial-gradient(
        ellipse at 30% 20%,
        rgba(99, 102, 241, 0.15) 0%,
        transparent 50%
    ),
    radial-gradient(
        ellipse at 70% 80%,
        rgba(217, 70, 239, 0.12) 0%,
        transparent 50%
    );
}

#icve-tabbed-panel.dark-theme .panel-container:hover {
    box-shadow:
        0 32px 64px rgba(0, 0, 0, 0.5),
        0 0 80px rgba(139, 92, 246, 0.3),
        inset 0 1px 1px rgba(255, 255, 255, 0.08);
}

/* 深色主题 - 卡片 */
#icve-tabbed-panel.dark-theme .status-card-compact::before {
    background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.15), transparent);
}

#icve-tabbed-panel.dark-theme .status-badge {
    background: var(--icve-bg-base);
}

/* 深色主题 - 滚动条 */
#icve-tabbed-panel.dark-theme .tab-content-wrapper::-webkit-scrollbar-thumb {
    background: linear-gradient(180deg, rgba(99, 102, 241, 0.6), rgba(217, 70, 239, 0.6));
}

/* 深色主题 - 设置区域 */
#icve-tabbed-panel.dark-theme .settings-section {
    box-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.08);
}

/* 深色主题 - 按钮 */
#icve-tabbed-panel.dark-theme .btn-toggle {
    background: var(--icve-bg-base);
}

/* 深色主题 - 输入框 */
#icve-tabbed-panel.dark-theme .input-with-unit,
#icve-tabbed-panel.dark-theme .input-with-unit-inline,
#icve-tabbed-panel.dark-theme .input-api-key,
#icve-tabbed-panel.dark-theme .input-unit-mini {
    background: var(--icve-bg-base);
}

#icve-tabbed-panel.dark-theme .select-control,
#icve-tabbed-panel.dark-theme .input-control {
    background: var(--icve-bg-base);
}

#icve-tabbed-panel.dark-theme .select-control:hover,
#icve-tabbed-panel.dark-theme .input-control:hover {
    background: var(--icve-bg-elevated);
}

#icve-tabbed-panel.dark-theme .select-control:focus,
#icve-tabbed-panel.dark-theme .input-control:focus {
    background: var(--icve-bg-base);
}

/* 深色主题 - 高级设置 */
#icve-tabbed-panel.dark-theme .advanced-settings summary,
#icve-tabbed-panel.dark-theme .advanced-mini summary {
    background: var(--icve-bg-base);
}

#icve-tabbed-panel.dark-theme .advanced-settings summary:hover,
#icve-tabbed-panel.dark-theme .advanced-mini summary:hover {
    background: var(--icve-bg-elevated);
}

/* 深色主题 - 答题页面 */
#icve-tabbed-panel.dark-theme .exam-status-compact,
#icve-tabbed-panel.dark-theme .exam-config-compact {
    background: rgba(30, 41, 59, 0.6);
}

#icve-tabbed-panel.dark-theme .config-row.config-key {
    background: linear-gradient(135deg, rgba(16, 185, 129, 0.08), rgba(52, 211, 153, 0.08));
    border-color: rgba(16, 185, 129, 0.2);
}

#icve-tabbed-panel.dark-theme .slider-mini {
    background: #475569;
}

#icve-tabbed-panel.dark-theme .advanced-body {
    background: rgba(30, 41, 59, 0.6);
}

#icve-tabbed-panel.dark-theme .status-msg-mini {
    background: rgba(30, 41, 59, 0.6);
}
`;
