/**
 * CSS 变量定义 - 设计令牌系统
 */
export const cssVariables = `
/* ==================== CSS 变量系统 ==================== */
:root {
    /* 主色调 - 极光渐变系 */
    --icve-primary-from: #6366f1;
    --icve-primary-via: #8b5cf6;
    --icve-primary-to: #d946ef;
    --icve-primary-glow: rgba(139, 92, 246, 0.4);

    /* 功能色 */
    --icve-success-from: #10b981;
    --icve-success-to: #34d399;
    --icve-success-glow: rgba(16, 185, 129, 0.35);
    --icve-warning-from: #f59e0b;
    --icve-warning-to: #fbbf24;
    --icve-warning-glow: rgba(245, 158, 11, 0.35);
    --icve-info-from: #0ea5e9;
    --icve-info-to: #38bdf8;
    --icve-info-glow: rgba(14, 165, 233, 0.35);
    --icve-danger-from: #ef4444;
    --icve-danger-to: #f87171;
    --icve-danger-glow: rgba(239, 68, 68, 0.35);

    /* 浅色主题 */
    --icve-bg-base: #f8fafc;
    --icve-bg-elevated: #ffffff;
    --icve-bg-sunken: #f1f5f9;
    --icve-bg-glass: rgba(255, 255, 255, 0.72);
    --icve-bg-glass-strong: rgba(255, 255, 255, 0.88);
    --icve-border-subtle: rgba(148, 163, 184, 0.2);
    --icve-border-default: rgba(148, 163, 184, 0.35);
    --icve-text-primary: #0f172a;
    --icve-text-secondary: #475569;
    --icve-text-tertiary: #94a3b8;
    --icve-text-inverted: #ffffff;
    --icve-shadow-ambient: 0 8px 32px rgba(15, 23, 42, 0.08);
    --icve-shadow-elevated: 0 24px 48px rgba(15, 23, 42, 0.12);
    --icve-shadow-glow: 0 0 60px rgba(139, 92, 246, 0.15);

    /* 动画 */
    --icve-ease-out-expo: cubic-bezier(0.16, 1, 0.3, 1);
    --icve-ease-spring: cubic-bezier(0.34, 1.56, 0.64, 1);
    --icve-duration-fast: 0.2s;
    --icve-duration-normal: 0.35s;
    --icve-duration-slow: 0.5s;

    /* 响应式断点相关 */
    --icve-panel-width: 400px;
    --icve-panel-padding: 20px;
}

/* 小屏幕适配 */
@media (max-width: 480px) {
    :root {
        --icve-panel-width: calc(100vw - 32px);
        --icve-panel-padding: 14px;
    }
}

@media (min-width: 481px) and (max-width: 768px) {
    :root {
        --icve-panel-width: 360px;
        --icve-panel-padding: 16px;
    }
}
`;
