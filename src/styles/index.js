/**
 * 完整CSS样式
 */
export function addStyles() {
    const style = document.createElement('style');
    style.textContent = `
            /* ==================== 导入字体 ==================== */
            @import url('https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;500;600;700;800&family=JetBrains+Mono:wght@400;500;600&display=swap');

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
            }

            /* ==================== 基础面板样式 ==================== */
            #icve-tabbed-panel {
                position: fixed;
                top: 24px;
                right: 24px;
                width: 400px;
                max-height: 92vh;
                z-index: 999999;
                font-family: 'Outfit', -apple-system, BlinkMacSystemFont, sans-serif;
                animation: icvePanelEnter 0.7s var(--icve-ease-out-expo);
            }

            @keyframes icvePanelEnter {
                0% {
                    opacity: 0;
                    transform: translateX(80px) scale(0.92) rotateY(-8deg);
                    filter: blur(8px);
                }
                100% {
                    opacity: 1;
                    transform: translateX(0) scale(1) rotateY(0);
                    filter: blur(0);
                }
            }

            .panel-container {
                background: var(--icve-bg-glass);
                backdrop-filter: blur(24px) saturate(180%);
                -webkit-backdrop-filter: blur(24px) saturate(180%);
                border-radius: 24px;
                border: 1px solid var(--icve-border-subtle);
                box-shadow:
                    var(--icve-shadow-elevated),
                    var(--icve-shadow-glow),
                    inset 0 1px 1px rgba(255, 255, 255, 0.6);
                overflow: hidden;
                display: flex;
                flex-direction: column;
                max-height: 92vh;
                transition: all var(--icve-duration-normal) var(--icve-ease-out-expo);
                position: relative;
            }

            /* 面板光晕背景 */
            .panel-container::before {
                content: '';
                position: absolute;
                top: -50%;
                left: -50%;
                width: 200%;
                height: 200%;
                background: radial-gradient(
                    ellipse at 30% 20%,
                    rgba(99, 102, 241, 0.08) 0%,
                    transparent 50%
                ),
                radial-gradient(
                    ellipse at 70% 80%,
                    rgba(217, 70, 239, 0.06) 0%,
                    transparent 50%
                );
                pointer-events: none;
                z-index: 0;
            }

            .panel-container:hover {
                box-shadow:
                    0 32px 64px rgba(15, 23, 42, 0.16),
                    0 0 80px rgba(139, 92, 246, 0.2),
                    inset 0 1px 1px rgba(255, 255, 255, 0.6);
            }

            /* ==================== 头部样式 ==================== */
            .panel-header {
                padding: 18px 20px;
                background: linear-gradient(
                    135deg,
                    var(--icve-primary-from) 0%,
                    var(--icve-primary-via) 50%,
                    var(--icve-primary-to) 100%
                );
                cursor: move;
                display: flex;
                justify-content: space-between;
                align-items: center;
                user-select: none;
                position: relative;
                z-index: 1;
                overflow: hidden;
            }

            /* 头部动态光效 */
            .panel-header::before {
                content: '';
                position: absolute;
                top: 0;
                left: -100%;
                width: 100%;
                height: 100%;
                background: linear-gradient(
                    90deg,
                    transparent 0%,
                    rgba(255, 255, 255, 0.2) 50%,
                    transparent 100%
                );
                animation: headerShine 4s ease-in-out infinite;
            }

            @keyframes headerShine {
                0%, 100% { left: -100%; }
                50% { left: 100%; }
            }

            /* 头部底部渐变阴影 */
            .panel-header::after {
                content: '';
                position: absolute;
                bottom: 0;
                left: 0;
                right: 0;
                height: 1px;
                background: linear-gradient(
                    90deg,
                    transparent 0%,
                    rgba(255, 255, 255, 0.4) 50%,
                    transparent 100%
                );
            }

            .panel-title {
                font-weight: 700;
                font-size: 16px;
                color: var(--icve-text-inverted);
                text-shadow: 0 2px 8px rgba(0, 0, 0, 0.2);
                letter-spacing: 0.5px;
                position: relative;
                z-index: 1;
                display: flex;
                align-items: center;
                gap: 8px;
            }

            .panel-title::before {
                content: '';
                width: 8px;
                height: 8px;
                background: var(--icve-text-inverted);
                border-radius: 50%;
                box-shadow: 0 0 12px rgba(255, 255, 255, 0.6);
                animation: titlePulse 2s ease-in-out infinite;
            }

            @keyframes titlePulse {
                0%, 100% { opacity: 1; transform: scale(1); }
                50% { opacity: 0.6; transform: scale(0.8); }
            }

            .header-controls {
                display: flex;
                gap: 10px;
                position: relative;
                z-index: 1;
            }

            /* 头部控制按钮动画优化 */
            .theme-toggle, .panel-toggle {
                background: rgba(255, 255, 255, 0.18);
                border: 1px solid rgba(255, 255, 255, 0.25);
                color: white;
                width: 36px;
                height: 36px;
                border-radius: 12px;
                cursor: pointer;
                font-size: 16px;
                transition: all var(--icve-duration-normal) var(--icve-ease-spring);
                display: flex;
                align-items: center;
                justify-content: center;
                backdrop-filter: blur(8px);
                position: relative;
                overflow: hidden;
            }

            .theme-toggle::before, .panel-toggle::before {
                content: '';
                position: absolute;
                inset: 0;
                background: rgba(255, 255, 255, 0);
                transition: background var(--icve-duration-fast) ease;
            }

            .theme-toggle:hover, .panel-toggle:hover {
                background: rgba(255, 255, 255, 0.28);
                border-color: rgba(255, 255, 255, 0.4);
                transform: scale(1.08) rotate(6deg);
                box-shadow: 0 6px 20px rgba(0, 0, 0, 0.2);
            }

            .theme-toggle:hover::before, .panel-toggle:hover::before {
                background: rgba(255, 255, 255, 0.1);
            }

            .theme-toggle:active, .panel-toggle:active {
                transform: scale(0.96) rotate(0deg);
                transition: transform 0.1s ease;
            }

            /* ==================== 标签页导航 ==================== */
            .tab-nav {
                display: flex;
                background: var(--icve-bg-sunken);
                padding: 8px 12px 0;
                gap: 4px;
                position: relative;
                z-index: 1;
            }

            .tab-btn {
                flex: 1;
                padding: 14px 16px;
                background: transparent;
                border: none;
                cursor: pointer;
                font-family: 'Outfit', sans-serif;
                font-size: 14px;
                font-weight: 600;
                color: var(--icve-text-tertiary);
                transition: all var(--icve-duration-normal) var(--icve-ease-out-expo);
                position: relative;
                border-radius: 14px 14px 0 0;
                letter-spacing: 0.3px;
            }

            .tab-btn:hover {
                color: var(--icve-primary-via);
                background: rgba(139, 92, 246, 0.08);
            }

            .tab-btn.active {
                color: var(--icve-primary-via);
                background: var(--icve-bg-glass-strong);
                box-shadow: 0 -4px 16px rgba(139, 92, 246, 0.1);
            }

            .tab-btn.active::after {
                content: '';
                position: absolute;
                bottom: 0;
                left: 16px;
                right: 16px;
                height: 3px;
                background: linear-gradient(
                    90deg,
                    var(--icve-primary-from),
                    var(--icve-primary-via),
                    var(--icve-primary-to)
                );
                border-radius: 3px 3px 0 0;
                animation: tabIndicator 0.4s var(--icve-ease-spring);
            }

            @keyframes tabIndicator {
                from {
                    transform: scaleX(0);
                    opacity: 0;
                }
                to {
                    transform: scaleX(1);
                    opacity: 1;
                }
            }

            /* ==================== 标签页内容 ==================== */
            .tab-content-wrapper {
                overflow-y: auto;
                max-height: calc(92vh - 140px);
                scrollbar-width: thin;
                scrollbar-color: rgba(139, 92, 246, 0.3) transparent;
                position: relative;
                z-index: 1;
            }

            .tab-content-wrapper::-webkit-scrollbar {
                width: 6px;
            }

            .tab-content-wrapper::-webkit-scrollbar-track {
                background: transparent;
            }

            .tab-content-wrapper::-webkit-scrollbar-thumb {
                background: linear-gradient(
                    180deg,
                    var(--icve-primary-from),
                    var(--icve-primary-to)
                );
                border-radius: 10px;
            }

            .tab-content-wrapper::-webkit-scrollbar-thumb:hover {
                background: linear-gradient(
                    180deg,
                    var(--icve-primary-via),
                    var(--icve-primary-to)
                );
            }

            .tab-content-wrapper.collapsed {
                display: none;
            }

            .tab-nav.collapsed {
                display: none;
            }

            .tab-pane {
                display: none;
                background: var(--icve-bg-glass-strong);
                animation: tabPaneFade 0.5s var(--icve-ease-out-expo);
            }

            @keyframes tabPaneFade {
                from {
                    opacity: 0;
                    transform: translateY(16px);
                }
                to {
                    opacity: 1;
                    transform: translateY(0);
                }
            }

            .tab-pane.active {
                display: block;
            }

            .tab-inner {
                padding: 20px;
            }

            /* ==================== 状态卡片 - 玻璃拟态 ==================== */
            /* ==================== 学习页面样式 ==================== */
            .learning-status-section {
                background: var(--icve-bg-glass);
                backdrop-filter: blur(12px);
                border-radius: 16px;
                padding: 14px 16px;
                margin-bottom: 14px;
                border: 1px solid var(--icve-border-subtle);
            }

            .status-row {
                display: flex;
                justify-content: space-between;
                align-items: center;
                margin-bottom: 12px;
            }

            .status-item {
                display: flex;
                align-items: center;
                gap: 6px;
                font-size: 13px;
                font-weight: 600;
                color: var(--icve-text-primary);
            }

            .status-dot {
                width: 8px;
                height: 8px;
                border-radius: 50%;
                background: #94a3b8;
                transition: all 0.3s ease;
            }

            .status-dot.running {
                background: #10b981;
                box-shadow: 0 0 8px rgba(16, 185, 129, 0.6);
                animation: pulse 1.5s infinite;
            }

            .status-dot.completed {
                background: #8b5cf6;
            }

            @keyframes pulse {
                0%, 100% { opacity: 1; }
                50% { opacity: 0.5; }
            }

            .learning-controls {
                display: flex;
                flex-direction: column;
                gap: 10px;
                margin-bottom: 14px;
            }

            .btn-large {
                width: 100%;
                padding: 14px 20px;
                font-size: 15px;
                background: linear-gradient(
                    135deg,
                    var(--icve-success-from) 0%,
                    var(--icve-success-to) 100%
                );
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
                cursor: not-allowed;
                opacity: 0.7;
            }

            .btn-group {
                display: flex;
                gap: 8px;
            }

            .btn-group .btn {
                flex: 1;
                padding: 10px 12px;
                font-size: 13px;
            }

            .btn-outline {
                background: var(--icve-bg-elevated) !important;
                color: #374151 !important;
                border: 1px solid var(--icve-border-subtle) !important;
            }

            .btn-outline:hover {
                background: var(--icve-bg-glass) !important;
                border-color: var(--icve-primary-from) !important;
            }

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

            .settings-grid {
                display: grid;
                grid-template-columns: 1fr 1fr;
                gap: 12px;
            }

            .status-card-compact {
                background: var(--icve-bg-glass);
                backdrop-filter: blur(12px);
                border-radius: 18px;
                padding: 16px;
                margin-bottom: 16px;
                border: 1px solid var(--icve-border-subtle);
                box-shadow:
                    var(--icve-shadow-ambient),
                    inset 0 1px 0 rgba(255, 255, 255, 0.5);
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
                background: linear-gradient(
                    90deg,
                    transparent,
                    rgba(255, 255, 255, 0.8),
                    transparent
                );
            }

            /* 状态卡片hover效果优化 */
            .status-card-compact:hover {
                transform: translateY(-2px);
                box-shadow:
                    0 12px 32px rgba(15, 23, 42, 0.1),
                    0 0 32px rgba(139, 92, 246, 0.08),
                    inset 0 1px 0 rgba(255, 255, 255, 0.5);
            }

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
                font-family: 'JetBrains Mono', monospace;
            }

            /* ==================== 进度条 - 渐变发光 ==================== */
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
                background: linear-gradient(
                    90deg,
                    var(--icve-primary-from),
                    var(--icve-primary-via),
                    var(--icve-primary-to)
                );
                width: 0%;
                transition: width 0.8s var(--icve-ease-out-expo);
                border-radius: 10px;
                position: relative;
                box-shadow:
                    0 0 20px var(--icve-primary-glow),
                    0 0 40px rgba(139, 92, 246, 0.2);
            }

            .progress-bar::before {
                content: attr(data-progress);
                position: absolute;
                top: 50%;
                transform: translateY(-50%);
                font-size: 11px;
                font-weight: 700;
                font-family: 'JetBrains Mono', monospace;
                color: var(--icve-primary-via);
                background: var(--icve-bg-elevated);
                padding: 4px 8px;
                border-radius: 6px;
                box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
                border: 1px solid var(--icve-border-subtle);
            }

            .progress-bar::after {
                content: '';
                position: absolute;
                top: 0;
                left: 0;
                right: 0;
                bottom: 0;
                background: linear-gradient(
                    90deg,
                    transparent 0%,
                    rgba(255, 255, 255, 0.4) 50%,
                    transparent 100%
                );
                animation: progressShimmer 2s ease-in-out infinite;
            }

            @keyframes progressShimmer {
                0% { transform: translateX(-100%); }
                100% { transform: translateX(100%); }
            }

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
            .control-buttons-group {
                margin-bottom: 16px;
            }

            .primary-actions {
                display: grid;
                grid-template-columns: 1fr 1fr;
                gap: 12px;
                margin-bottom: 12px;
            }

            .btn {
                padding: 12px 16px;
                border: none;
                border-radius: 14px;
                cursor: pointer;
                font-family: 'Outfit', sans-serif;
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
                background: linear-gradient(
                    180deg,
                    rgba(255, 255, 255, 0.2) 0%,
                    transparent 100%
                );
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

            .btn-primary {
                height: 50px;
                font-size: 15px;
            }

            .btn-start {
                background: linear-gradient(
                    135deg,
                    var(--icve-success-from) 0%,
                    var(--icve-success-to) 100%
                );
                box-shadow:
                    0 4px 16px var(--icve-success-glow),
                    inset 0 1px 0 rgba(255, 255, 255, 0.2);
            }

            /* 按钮hoer效果优化 */
            .btn-start:hover:not(:disabled) {
                transform: translateY(-2px) scale(1.01);
                box-shadow:
                    0 6px 24px var(--icve-success-glow),
                    0 0 32px rgba(16, 185, 129, 0.18),
                    inset 0 1px 0 rgba(255, 255, 255, 0.2);
            }

            .btn-start:active:not(:disabled) {
                transform: translateY(0) scale(0.98);
                transition: transform 0.1s ease;
            }

            .btn-stop {
                background: linear-gradient(
                    135deg,
                    var(--icve-warning-from) 0%,
                    var(--icve-warning-to) 100%
                );
                box-shadow:
                    0 4px 16px var(--icve-warning-glow),
                    inset 0 1px 0 rgba(255, 255, 255, 0.2);
            }

            .btn-stop:hover:not(:disabled) {
                transform: translateY(-2px) scale(1.01);
                box-shadow:
                    0 6px 24px var(--icve-warning-glow),
                    0 0 32px rgba(245, 158, 11, 0.18),
                    inset 0 1px 0 rgba(255, 255, 255, 0.2);
            }

            .btn-stop:active:not(:disabled) {
                transform: translateY(0) scale(0.98);
                transition: transform 0.1s ease;
            }

            .secondary-actions {
                display: flex;
                gap: 8px;
            }

            .btn-secondary {
                flex: 1;
                height: 40px;
                font-size: 13px;
                font-weight: 600;
                background: linear-gradient(
                    135deg,
                    #64748b 0%,
                    #475569 100%
                );
                box-shadow:
                    0 3px 12px rgba(71, 85, 105, 0.3),
                    inset 0 1px 0 rgba(255, 255, 255, 0.15);
            }

            .btn-secondary:hover:not(:disabled) {
                transform: translateY(-1px);
                box-shadow:
                    0 4px 16px rgba(71, 85, 105, 0.3),
                    inset 0 1px 0 rgba(255, 255, 255, 0.15);
            }

            .btn-secondary:active:not(:disabled) {
                transform: translateY(0);
                transition: transform 0.1s ease;
            }

            .btn-scan {
                background: linear-gradient(
                    135deg,
                    var(--icve-info-from) 0%,
                    var(--icve-info-to) 100%
                );
                box-shadow:
                    0 3px 12px var(--icve-info-glow),
                    inset 0 1px 0 rgba(255, 255, 255, 0.15);
            }

            .btn-scan:hover:not(:disabled) {
                transform: translateY(-1px);
                box-shadow:
                    0 5px 18px var(--icve-info-glow),
                    inset 0 1px 0 rgba(255, 255, 255, 0.15);
            }

            .btn-reset {
                background: linear-gradient(
                    135deg,
                    var(--icve-primary-via) 0%,
                    var(--icve-primary-to) 100%
                );
                box-shadow:
                    0 3px 12px var(--icve-primary-glow),
                    inset 0 1px 0 rgba(255, 255, 255, 0.15);
            }

            .btn-reset:hover:not(:disabled) {
                transform: translateY(-1px);
                box-shadow:
                    0 5px 18px var(--icve-primary-glow),
                    inset 0 1px 0 rgba(255, 255, 255, 0.15);
            }

            /* 静音切换按钮优化 */
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
                box-shadow:
                    0 8px 24px rgba(0, 0, 0, 0.06),
                    inset 0 1px 0 rgba(255, 255, 255, 0.4);
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

            .settings-grid-compact {
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
                font-family: 'JetBrains Mono', monospace;
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

            .select-control, .input-control {
                width: 100%;
                padding: 10px 12px;
                border: 2px solid var(--icve-border-default);
                border-radius: 10px;
                background: var(--icve-bg-elevated);
                color: var(--icve-text-primary);
                font-family: 'Outfit', sans-serif;
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

            /* ==================== 答题页配置 ==================== */
            .quick-config {
                display: flex;
                gap: 10px;
                margin-bottom: 16px;
                padding: 14px;
                background: var(--icve-bg-glass);
                backdrop-filter: blur(8px);
                border-radius: 14px;
                border: 1px solid var(--icve-border-subtle);
            }

            .config-item {
                flex: 1;
                display: flex;
                align-items: center;
                gap: 8px;
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
                font-family: 'JetBrains Mono', monospace;
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
                font-family: 'JetBrains Mono', monospace;
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

            /* ==================== API 密钥区域 ==================== */
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
                font-family: 'JetBrains Mono', monospace;
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

            /* ==================== 状态消息 ==================== */
            .status-message {
                padding: 12px 16px;
                background: var(--icve-bg-glass);
                backdrop-filter: blur(8px);
                border-radius: 12px;
                font-size: 13px;
                color: var(--icve-text-secondary);
                text-align: center;
                margin-bottom: 12px;
                border: 1px solid var(--icve-border-subtle);
                transition: all var(--icve-duration-normal) var(--icve-ease-out-expo);
                font-weight: 500;
            }

            .status-message:hover {
                border-color: var(--icve-border-default);
                box-shadow: 0 4px 16px rgba(0, 0, 0, 0.05);
            }

            /* ==================== 高级设置 ==================== */
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

            #icve-tabbed-panel.dark-theme .status-card-compact::before {
                background: linear-gradient(
                    90deg,
                    transparent,
                    rgba(255, 255, 255, 0.15),
                    transparent
                );
            }

            #icve-tabbed-panel.dark-theme .status-badge {
                background: var(--icve-bg-base);
            }

            #icve-tabbed-panel.dark-theme .progress-bar::before {
                background: var(--icve-bg-base);
            }

            #icve-tabbed-panel.dark-theme .tab-content-wrapper::-webkit-scrollbar-thumb {
                background: linear-gradient(
                    180deg,
                    rgba(99, 102, 241, 0.6),
                    rgba(217, 70, 239, 0.6)
                );
            }

            #icve-tabbed-panel.dark-theme .settings-section {
                box-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.08);
            }

            #icve-tabbed-panel.dark-theme .btn-toggle {
                background: var(--icve-bg-base);
            }

            #icve-tabbed-panel.dark-theme .input-with-unit {
                background: var(--icve-bg-base);
            }

            #icve-tabbed-panel.dark-theme .input-with-unit-inline {
                background: var(--icve-bg-base);
            }

            #icve-tabbed-panel.dark-theme .input-api-key {
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

            #icve-tabbed-panel.dark-theme .advanced-settings summary {
                background: var(--icve-bg-base);
            }

            #icve-tabbed-panel.dark-theme .advanced-settings summary:hover {
                background: var(--icve-bg-elevated);
            }

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

            .status-row {
                display: flex;
                gap: 10px;
                margin-bottom: 8px;
            }

            .status-row:last-child {
                margin-bottom: 0;
            }

            .status-item {
                flex: 1;
                display: flex;
                justify-content: space-between;
                align-items: center;
                font-size: 12px;
                padding: 8px 12px;
                background: var(--icve-bg-elevated);
                border-radius: 10px;
            }

            .label {
                color: var(--icve-text-tertiary);
                font-weight: 600;
            }

            .value {
                font-weight: 700;
                font-size: 14px;
                color: var(--icve-text-primary);
                font-family: 'JetBrains Mono', monospace;
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

            .progress-section {
                background: var(--icve-bg-glass);
                backdrop-filter: blur(12px);
                border-radius: 16px;
                padding: 16px;
                border: 1px solid var(--icve-border-subtle);
            }

            .progress-label {
                display: flex;
                align-items: center;
                gap: 6px;
                margin-bottom: 10px;
                font-size: 13px;
                color: var(--icve-text-secondary);
                font-weight: 600;
            }

            .progress-icon {
                font-size: 16px;
                line-height: 1;
            }

            .switches {
                display: flex;
                flex-direction: column;
                gap: 8px;
            }

            /* ==================== 页面日志样式 ==================== */
            .log-tab-container {
                display: flex;
                flex-direction: column;
                height: 100%;
                max-height: calc(92vh - 140px);
            }

            .log-container {
                flex: 1;
                overflow-y: auto;
                padding: 12px;
                background: var(--icve-bg-elevated);
                font-family: 'JetBrains Mono', monospace;
                font-size: 12px;
                scrollbar-width: thin;
                scrollbar-color: rgba(139, 92, 246, 0.3) transparent;
                min-height: 280px;
            }

            .log-container::-webkit-scrollbar {
                width: 6px;
            }

            .log-container::-webkit-scrollbar-track {
                background: transparent;
            }

            .log-container::-webkit-scrollbar-thumb {
                background: linear-gradient(
                    180deg,
                    var(--icve-primary-from),
                    var(--icve-primary-to)
                );
                border-radius: 3px;
            }

            .log-footer {
                display: flex;
                justify-content: space-between;
                align-items: center;
                padding: 12px 16px;
                background: var(--icve-bg-glass);
                border-top: 1px solid var(--icve-border-subtle);
            }

            .log-count-text {
                font-size: 13px;
                font-weight: 600;
                color: var(--icve-text-secondary);
            }

            .btn-clear-log {
                height: 34px;
                padding: 0 16px;
                font-size: 13px;
            }

            .log-entry {
                display: flex;
                align-items: flex-start;
                gap: 8px;
                padding: 8px 0;
                border-bottom: 1px solid var(--icve-border-subtle);
                animation: logEntryEnter 0.3s ease-out;
            }

            @keyframes logEntryEnter {
                from {
                    opacity: 0;
                    transform: translateX(20px);
                }
                to {
                    opacity: 1;
                    transform: translateX(0);
                }
            }

            .log-entry:last-child {
                border-bottom: none;
            }

            .log-time {
                color: var(--icve-text-tertiary);
                font-weight: 500;
                min-width: 70px;
            }

            .log-icon {
                font-size: 14px;
                line-height: 1;
            }

            .log-message {
                flex: 1;
                color: var(--icve-text-primary);
                word-break: break-word;
                line-height: 1.4;
            }

            .log-info .log-icon { color: var(--icve-info-from); }
            .log-success .log-icon { color: var(--icve-success-from); }
            .log-warn .log-icon { color: var(--icve-warning-from); }
            .log-error .log-icon { color: var(--icve-danger-from); }

            .log-info .log-message { color: var(--icve-text-primary); }
            .log-success .log-message { color: var(--icve-success-from); }
            .log-warn .log-message { color: var(--icve-warning-from); }
            .log-error .log-message { color: var(--icve-danger-from); font-weight: 600; }

            .log-placeholder {
                text-align: center;
                color: var(--icve-text-tertiary);
                padding: 40px 20px;
                font-style: italic;
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

            .settings-grid {
                display: grid;
                grid-template-columns: repeat(2, 1fr);
                gap: 12px;
            }

            .setting-row, .setting-row-full {
                display: flex;
                flex-direction: column;
                gap: 8px;
            }

            .setting-row-full {
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
                font-family: 'JetBrains Mono', monospace;
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
                font-family: 'JetBrains Mono', monospace;
            }
        `;
        document.head.appendChild(style);
    }