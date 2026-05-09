/**
 * UI 重构样式 - 浅色优先的启动器和工作台
 */
export const refactorStyles = `
#icve-tabbed-panel {
    --ui-bg-root: #f7f9fc;
    --ui-bg-surface: #ffffff;
    --ui-bg-subtle: #f2f6fb;
    --ui-bg-hover: #eaf2fb;
    --ui-border: #dbe5f0;
    --ui-border-strong: #bfd0e3;
    --ui-text: #1f2a3d;
    --ui-text-muted: #66758a;
    --ui-text-subtle: #9aa8ba;
    --ui-primary: #3b82f6;
    --ui-primary-soft: #dbeafe;
    --ui-primary-hover: #2563eb;
    --ui-success: #10b981;
    --ui-success-soft: #d1fae5;
    --ui-warning: #f59e0b;
    --ui-warning-soft: #fef3c7;
    --ui-danger: #ef4444;
    --ui-danger-soft: #fee2e2;
    --ui-shadow: 0 14px 36px rgba(31, 42, 61, 0.12);
    position: fixed;
    top: 24px;
    right: 24px;
    width: 430px;
    max-width: calc(100vw - 32px);
    z-index: 999999;
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'PingFang SC', 'Microsoft YaHei', sans-serif;
    color: var(--ui-text);
}

#icve-tabbed-panel.dark-theme {
    --ui-bg-root: #0b1020;
    --ui-bg-surface: #111827;
    --ui-bg-subtle: #182235;
    --ui-bg-hover: #223047;
    --ui-border: #2c3a51;
    --ui-border-strong: #3e4f68;
    --ui-text: #e7eef9;
    --ui-text-muted: #a8b4c7;
    --ui-text-subtle: #718198;
    --ui-primary: #60a5fa;
    --ui-primary-soft: rgba(96, 165, 250, 0.16);
    --ui-primary-hover: #93c5fd;
    --ui-success: #34d399;
    --ui-success-soft: rgba(52, 211, 153, 0.16);
    --ui-warning: #fbbf24;
    --ui-warning-soft: rgba(251, 191, 36, 0.16);
    --ui-danger: #f87171;
    --ui-danger-soft: rgba(248, 113, 113, 0.16);
    --ui-shadow: 0 18px 48px rgba(0, 0, 0, 0.42);
}

#icve-tabbed-panel,
#icve-tabbed-panel * {
    box-sizing: border-box;
    letter-spacing: 0;
}

#icve-tabbed-panel .icve-launcher {
    display: flex;
    align-items: center;
    gap: 10px;
    min-width: 264px;
    min-height: 52px;
    max-width: min(308px, calc(100vw - 32px));
    margin-left: auto;
    padding: 0 16px 0 12px;
    border: 1px solid #b7cce2;
    border-radius: 999px;
    background: var(--ui-bg-surface);
    color: var(--ui-text);
    box-shadow: 0 16px 38px rgba(31, 42, 61, 0.16), 0 0 0 4px rgba(59, 130, 246, 0.08);
    cursor: grab;
    font: inherit;
    user-select: none;
    touch-action: none;
    transition: transform 0.18s ease, border-color 0.18s ease, background 0.18s ease, box-shadow 0.18s ease;
}

#icve-tabbed-panel .icve-launcher:hover {
    transform: translateY(-2px);
    border-color: #8eb1d6;
    background: #f8fbff;
    box-shadow: 0 18px 42px rgba(31, 42, 61, 0.18), 0 0 0 5px rgba(59, 130, 246, 0.12);
}

#icve-tabbed-panel .icve-launcher:active {
    cursor: grabbing;
    transform: translateY(0);
}

#icve-tabbed-panel .launcher-grip {
    width: 14px;
    height: 28px;
    flex: 0 0 auto;
    border-radius: 999px;
    background:
        radial-gradient(circle, #8aa3bf 1.2px, transparent 1.4px) 1px 2px / 6px 6px,
        radial-gradient(circle, #8aa3bf 1.2px, transparent 1.4px) 5px 2px / 6px 6px;
    opacity: 0.9;
}

#icve-tabbed-panel .launcher-dot {
    width: 10px;
    height: 10px;
    border-radius: 50%;
    background: var(--ui-success);
    flex: 0 0 auto;
    box-shadow: 0 0 0 4px var(--ui-success-soft);
}

#icve-tabbed-panel .launcher-dot.running {
    background: var(--ui-primary);
}

#icve-tabbed-panel .launcher-dot.error {
    background: var(--ui-danger);
}

#icve-tabbed-panel .launcher-title {
    font-size: 14px;
    font-weight: 700;
    white-space: nowrap;
}

#icve-tabbed-panel .launcher-meta {
    padding-left: 4px;
    font-size: 12px;
    color: var(--ui-text-muted);
    white-space: nowrap;
}

#icve-tabbed-panel.is-open .icve-launcher {
    display: none;
}

#icve-tabbed-panel.is-collapsed {
    width: max-content;
}

#icve-tabbed-panel.is-collapsed .icve-launcher {
    display: flex;
}

#icve-tabbed-panel.is-collapsed .panel-container {
    display: none;
}

#icve-tabbed-panel .panel-container {
    width: 100%;
    max-height: min(820px, calc(100vh - 48px));
    overflow: hidden;
    display: flex;
    flex-direction: column;
    background: var(--ui-bg-surface);
    border: 1px solid var(--ui-border);
    border-radius: 16px;
    box-shadow: var(--ui-shadow);
    backdrop-filter: none;
    -webkit-backdrop-filter: none;
    position: relative;
}

#icve-tabbed-panel .panel-container::before,
#icve-tabbed-panel .panel-header::before,
#icve-tabbed-panel .panel-header::after {
    display: none;
}

#icve-tabbed-panel .panel-header {
    height: 54px;
    padding: 0 14px 0 16px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    cursor: move;
    user-select: none;
    background: var(--ui-bg-surface);
    border-bottom: 1px solid var(--ui-border);
    position: relative;
    z-index: 3;
}

#icve-tabbed-panel .panel-title {
    color: var(--ui-text);
    font-size: 15px;
    font-weight: 750;
    text-shadow: none;
}

#icve-tabbed-panel .panel-title::before {
    display: none;
}

#icve-tabbed-panel .header-controls {
    display: flex;
    align-items: center;
    gap: 6px;
}

#icve-tabbed-panel .theme-toggle,
#icve-tabbed-panel .panel-toggle {
    min-width: 32px;
    height: 32px;
    padding: 0;
    border-radius: 9px;
    border: 1px solid var(--ui-border);
    background: var(--ui-bg-subtle);
    color: var(--ui-text-muted);
    box-shadow: none;
    cursor: pointer;
    font-size: 12px;
    font-weight: 700;
    transform: none;
}

#icve-tabbed-panel .theme-toggle {
    min-width: 42px;
}

#icve-tabbed-panel .theme-toggle:hover,
#icve-tabbed-panel .panel-toggle:hover {
    background: var(--ui-bg-hover);
    border-color: var(--ui-border-strong);
    color: var(--ui-text);
    transform: none;
}

#icve-tabbed-panel .workbench-body {
    padding: 14px;
    overflow-y: auto;
    max-height: calc(min(820px, 100vh - 48px) - 54px);
    background: var(--ui-bg-root);
}

#icve-tabbed-panel .task-switcher {
    display: grid;
    grid-template-columns: repeat(var(--task-count, 3), minmax(0, 1fr));
    gap: 4px;
    padding: 4px;
    margin-bottom: 12px;
    background: var(--ui-bg-subtle);
    border: 1px solid var(--ui-border);
    border-radius: 12px;
}

#icve-tabbed-panel .task-switch-btn {
    height: 32px;
    border: 0;
    border-radius: 8px;
    background: transparent;
    color: var(--ui-text-muted);
    cursor: pointer;
    font: inherit;
    font-size: 13px;
    font-weight: 700;
}

#icve-tabbed-panel .task-switch-btn.active {
    background: var(--ui-bg-surface);
    color: var(--ui-primary);
    box-shadow: 0 1px 3px rgba(31, 42, 61, 0.08);
}

#icve-tabbed-panel .workbench-task[hidden] {
    display: none;
}

#icve-tabbed-panel .task-card,
#icve-tabbed-panel .recent-events,
#icve-tabbed-panel .config-card {
    background: var(--ui-bg-surface);
    border: 1px solid var(--ui-border);
    border-radius: 14px;
    box-shadow: none;
}

#icve-tabbed-panel .task-card {
    padding: 14px;
}

#icve-tabbed-panel .task-card-header {
    display: flex;
    justify-content: space-between;
    gap: 12px;
    align-items: flex-start;
    margin-bottom: 12px;
}

#icve-tabbed-panel .section-kicker,
#icve-tabbed-panel .metric-label {
    color: var(--ui-text-subtle);
    font-size: 11px;
    font-weight: 700;
    text-transform: uppercase;
}

#icve-tabbed-panel .task-card h2 {
    margin: 3px 0 0;
    font-size: 20px;
    line-height: 1.2;
    color: var(--ui-text);
}

#icve-tabbed-panel .task-status {
    display: inline-flex;
    align-items: center;
    gap: 6px;
    min-height: 28px;
    padding: 0 9px;
    border-radius: 999px;
    background: var(--ui-bg-subtle);
    color: var(--ui-text-muted);
    font-size: 12px;
    font-weight: 700;
}

#icve-tabbed-panel .status-dot {
    width: 8px;
    height: 8px;
    border-radius: 50%;
    background: var(--ui-text-subtle);
    box-shadow: none;
}

#icve-tabbed-panel .status-dot.running {
    background: var(--ui-success);
    box-shadow: none;
    animation: none;
}

#icve-tabbed-panel .status-dot.completed {
    background: var(--ui-primary);
    box-shadow: none;
}

#icve-tabbed-panel .task-metrics {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 8px;
    margin-bottom: 12px;
}

#icve-tabbed-panel .task-metrics > div,
#icve-tabbed-panel .quick-settings > div {
    min-width: 0;
    padding: 10px;
    background: var(--ui-bg-subtle);
    border-radius: 10px;
}

#icve-tabbed-panel .task-metrics strong,
#icve-tabbed-panel .quick-settings strong {
    display: block;
    margin-top: 3px;
    color: var(--ui-text);
    font-size: 13px;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
}

#icve-tabbed-panel .progress-bar-wrapper {
    height: 8px;
    margin: 0 0 12px;
    background: var(--ui-bg-subtle);
    border-radius: 999px;
    box-shadow: none;
    overflow: hidden;
}

#icve-tabbed-panel .progress-bar {
    height: 100%;
    border-radius: inherit;
    background: var(--ui-primary);
    box-shadow: none;
}

#icve-tabbed-panel .progress-bar::before,
#icve-tabbed-panel .progress-bar::after {
    display: none;
}

#icve-tabbed-panel .current-line {
    display: flex;
    justify-content: space-between;
    gap: 12px;
    align-items: center;
    padding: 9px 0;
    color: var(--ui-text-muted);
    border-top: 1px solid var(--ui-border);
    font-size: 12px;
}

#icve-tabbed-panel .current-line strong {
    min-width: 0;
    color: var(--ui-text);
    text-align: right;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
}

#icve-tabbed-panel .inline-status {
    padding-top: 8px;
    color: var(--ui-text-muted);
    font-size: 12px;
    line-height: 1.45;
}

#icve-tabbed-panel .primary-action-block {
    margin-top: 12px;
}

#icve-tabbed-panel .action-pair {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 8px;
    margin-top: 8px;
}

#icve-tabbed-panel .btn {
    min-height: 38px;
    padding: 0 12px;
    border-radius: 10px;
    border: 1px solid transparent;
    box-shadow: none;
    cursor: pointer;
    font: inherit;
    font-size: 13px;
    font-weight: 750;
    transition: background 0.18s ease, border-color 0.18s ease, color 0.18s ease, transform 0.12s ease;
}

#icve-tabbed-panel .btn::before,
#icve-tabbed-panel .btn::after {
    display: none;
}

#icve-tabbed-panel .btn:hover:not(:disabled) {
    transform: translateY(-1px);
}

#icve-tabbed-panel .btn:disabled {
    opacity: 0.48;
    cursor: not-allowed;
    transform: none;
    filter: none;
}

#icve-tabbed-panel .btn-primary,
#icve-tabbed-panel .btn-large {
    width: 100%;
    height: 42px;
    background: var(--ui-primary);
    border-color: var(--ui-primary);
    color: #ffffff !important;
}

#icve-tabbed-panel .btn-primary:hover:not(:disabled),
#icve-tabbed-panel .btn-large:hover:not(:disabled) {
    background: var(--ui-primary-hover);
}

#icve-tabbed-panel .btn-secondary {
    background: var(--ui-bg-subtle);
    color: var(--ui-text);
    border-color: var(--ui-border);
}

#icve-tabbed-panel .btn-outline {
    background: var(--ui-bg-surface) !important;
    color: var(--ui-text) !important;
    border-color: var(--ui-border) !important;
}

#icve-tabbed-panel .btn-danger {
    background: var(--ui-danger-soft);
    color: var(--ui-danger);
    border-color: transparent;
}

#icve-tabbed-panel .quick-settings {
    display: grid;
    grid-template-columns: repeat(3, minmax(0, 1fr));
    gap: 8px;
    margin-top: 12px;
}

#icve-tabbed-panel .quick-settings span {
    color: var(--ui-text-subtle);
    font-size: 11px;
    font-weight: 700;
}

#icve-tabbed-panel .recent-events {
    padding: 12px;
    margin-top: 12px;
    min-height: 174px;
}

#icve-tabbed-panel .recent-events-head {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 10px;
}

#icve-tabbed-panel .recent-clear-btn {
    height: 24px;
    padding: 0 9px;
    border: 1px solid var(--ui-border);
    border-radius: 7px;
    background: var(--ui-bg-subtle);
    color: var(--ui-text-muted);
    cursor: pointer;
    font: inherit;
    font-size: 11px;
    font-weight: 750;
}

#icve-tabbed-panel .recent-clear-btn:hover {
    border-color: var(--ui-border-strong);
    background: var(--ui-bg-hover);
    color: var(--ui-text);
}

#icve-tabbed-panel[data-task="config"] .recent-events {
    display: none;
}

#icve-tabbed-panel #recent-events-list {
    display: flex;
    flex-direction: column;
    gap: 6px;
    margin-top: 8px;
    max-height: 132px;
    overflow-y: auto;
    padding-right: 2px;
}

#icve-tabbed-panel .recent-event {
    display: grid;
    grid-template-columns: 54px minmax(0, 1fr);
    gap: 8px;
    align-items: start;
    color: var(--ui-text-muted);
    font-size: 12px;
    min-height: 18px;
}

#icve-tabbed-panel .recent-event strong {
    min-width: 0;
    color: var(--ui-text);
    font-weight: 600;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
}

#icve-tabbed-panel .recent-placeholder {
    color: var(--ui-text-subtle);
    font-size: 12px;
}

#icve-tabbed-panel[data-task="config"] .workbench-body {
    overflow-y: hidden;
}

#icve-tabbed-panel .config-card {
    padding: 10px 12px 12px;
}

#icve-tabbed-panel .config-card-head {
    display: flex;
    justify-content: space-between;
    gap: 10px;
    align-items: center;
    margin-bottom: 8px;
}

#icve-tabbed-panel .config-card h2 {
    margin: 0;
    color: var(--ui-text);
    font-size: 15px;
    line-height: 1.2;
}

#icve-tabbed-panel .config-pill {
    flex: 0 0 auto;
    max-width: 158px;
    padding: 4px 8px;
    border-radius: 999px;
    background: var(--ui-bg-subtle);
    color: var(--ui-primary);
    font-size: 11px;
    font-weight: 750;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
}

#icve-tabbed-panel .config-rows {
    display: flex;
    flex-direction: column;
    gap: 7px;
}

#icve-tabbed-panel .config-row {
    display: grid;
    grid-template-columns: 42px minmax(0, 1fr);
    gap: 8px;
    align-items: start;
    padding-top: 7px;
    border-top: 1px solid var(--ui-border);
}

#icve-tabbed-panel .config-row-title {
    padding-top: 19px;
    color: var(--ui-text-subtle);
    font-size: 11px;
    font-weight: 750;
}

#icve-tabbed-panel .config-fields {
    display: grid;
    gap: 7px;
    align-items: end;
    min-width: 0;
}

#icve-tabbed-panel .config-fields-learning {
    grid-template-columns: 0.9fr repeat(3, 0.78fr) 54px;
}

#icve-tabbed-panel .config-fields-exam {
    grid-template-columns: 112px 54px;
    justify-content: start;
}

#icve-tabbed-panel .config-row-actions {
    align-items: center;
}

#icve-tabbed-panel .config-row-actions .config-row-title {
    padding-top: 0;
}

#icve-tabbed-panel .config-fields-ai {
    grid-template-columns: 0.95fr 1.05fr;
}

#icve-tabbed-panel .field-full {
    grid-column: 1 / -1;
}

#icve-tabbed-panel .field {
    display: flex;
    flex-direction: column;
    gap: 4px;
}

#icve-tabbed-panel .field {
    min-width: 0;
    margin-bottom: 0;
}

#icve-tabbed-panel .field > span,
#icve-tabbed-panel .toggle-row > span {
    color: var(--ui-text-muted);
    font-size: 11px;
    font-weight: 700;
}

#icve-tabbed-panel .select-control,
#icve-tabbed-panel .input-control {
    width: 100%;
    height: 28px;
    padding: 0 8px;
    border: 1px solid var(--ui-border);
    border-radius: 8px;
    background: var(--ui-bg-surface);
    color: var(--ui-text);
    font: inherit;
    font-size: 12px;
    box-shadow: none;
    outline: none;
}

#icve-tabbed-panel .select-control:focus,
#icve-tabbed-panel .input-control:focus {
    border-color: var(--ui-primary);
    box-shadow: 0 0 0 3px var(--ui-primary-soft);
}

#icve-tabbed-panel .input-with-unit {
    display: grid;
    grid-template-columns: minmax(0, 1fr) auto;
    align-items: center;
    padding: 0 7px 0 0;
    border: 1px solid var(--ui-border);
    border-radius: 8px;
    background: var(--ui-bg-surface);
}

#icve-tabbed-panel .input-with-unit .input-control {
    border: 0;
    box-shadow: none;
    background: transparent;
}

#icve-tabbed-panel .input-with-unit .unit {
    color: var(--ui-text-subtle);
    font-size: 11px;
    font-weight: 700;
}

#icve-tabbed-panel .toggle-row {
    min-height: 28px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 8px;
    padding: 0;
    min-width: 0;
}

#icve-tabbed-panel .toggle-field {
    align-items: stretch;
}

#icve-tabbed-panel .toggle-field input[type="checkbox"] {
    margin: 0;
}

#icve-tabbed-panel .toggle-row input[type="checkbox"],
#icve-tabbed-panel .toggle-field input[type="checkbox"] {
    appearance: none;
    -webkit-appearance: none;
    width: 48px;
    height: 28px;
    flex: 0 0 auto;
    position: relative;
    border: 1px solid var(--ui-border-strong);
    border-radius: 999px;
    background: var(--ui-bg-subtle);
    cursor: pointer;
    outline: none;
    transition: background 0.18s ease, border-color 0.18s ease;
}

#icve-tabbed-panel .toggle-row input[type="checkbox"]::before,
#icve-tabbed-panel .toggle-field input[type="checkbox"]::before {
    content: '';
    position: absolute;
    width: 22px;
    height: 22px;
    left: 2px;
    top: 2px;
    border-radius: 50%;
    background: var(--ui-bg-surface);
    box-shadow: 0 1px 2px rgba(31, 42, 61, 0.18);
    transition: transform 0.18s ease;
}

#icve-tabbed-panel .toggle-row input[type="checkbox"]:checked,
#icve-tabbed-panel .toggle-field input[type="checkbox"]:checked {
    border-color: var(--ui-primary);
    background: var(--ui-primary);
}

#icve-tabbed-panel .toggle-row input[type="checkbox"]:checked::before,
#icve-tabbed-panel .toggle-field input[type="checkbox"]:checked::before {
    transform: translateX(20px);
}

#icve-tabbed-panel .toggle-row input[type="checkbox"]:focus-visible,
#icve-tabbed-panel .toggle-field input[type="checkbox"]:focus-visible {
    box-shadow: 0 0 0 3px var(--ui-primary-soft);
}

#icve-tabbed-panel .api-key-input-wrap {
    display: grid;
    grid-template-columns: minmax(0, 1fr) 42px;
    gap: 5px;
    align-items: center;
}

#icve-tabbed-panel .api-key-toggle {
    height: 28px;
    border: 1px solid var(--ui-border);
    border-radius: 8px;
    background: var(--ui-bg-subtle);
    color: var(--ui-text-muted);
    font-size: 11px;
    font-weight: 750;
    cursor: pointer;
}

#icve-tabbed-panel .config-test-cell {
    display: grid;
    grid-column: 1 / -1;
    grid-template-columns: 58px minmax(0, 1fr);
    gap: 5px;
    align-items: stretch;
}

#icve-tabbed-panel .config-test-action {
    width: 100%;
    min-height: 28px;
    padding: 0 8px;
    border-radius: 8px;
}

#icve-tabbed-panel .config-test-status {
    min-width: 0;
    min-height: 28px;
    display: flex;
    align-items: center;
    padding: 0 8px;
    border: 1px solid var(--ui-border);
    border-radius: 8px;
    background: var(--ui-bg-subtle);
    color: var(--ui-text-muted);
    font-size: 11px;
    line-height: 1.35;
    font-weight: 750;
    overflow: visible;
    white-space: normal;
    word-break: break-word;
}

#icve-tabbed-panel .config-test-status.is-pending {
    color: var(--ui-primary);
    border-color: var(--ui-primary-soft);
    background: var(--ui-primary-soft);
}

#icve-tabbed-panel .config-test-status.is-success {
    color: var(--ui-success);
    border-color: var(--ui-success-soft);
    background: var(--ui-success-soft);
}

#icve-tabbed-panel .config-test-status.is-error {
    color: var(--ui-danger);
    border-color: var(--ui-danger-soft);
    background: var(--ui-danger-soft);
}

#icve-tabbed-panel .config-actions,
#icve-tabbed-panel .config-action-row {
    display: grid;
    grid-template-columns: repeat(4, minmax(0, 1fr));
    gap: 6px;
}

#icve-tabbed-panel .config-actions .btn,
#icve-tabbed-panel .config-action-row .btn {
    min-height: 28px;
    height: 28px;
    padding: 0 8px;
    border-radius: 8px;
    font-size: 12px;
}

@media (max-width: 480px) {
    #icve-tabbed-panel {
        top: 16px;
        right: 16px;
        width: calc(100vw - 32px);
    }

    #icve-tabbed-panel .panel-container {
        max-height: calc(100vh - 32px);
    }

    #icve-tabbed-panel .workbench-body {
        max-height: calc(100vh - 86px);
    }

    #icve-tabbed-panel .quick-settings {
        grid-template-columns: repeat(2, 1fr);
    }

    #icve-tabbed-panel[data-task="config"] .workbench-body {
        overflow-y: auto;
    }

    #icve-tabbed-panel .config-row,
    #icve-tabbed-panel .config-fields,
    #icve-tabbed-panel .config-fields-learning,
    #icve-tabbed-panel .config-fields-exam,
    #icve-tabbed-panel .config-fields-ai {
        grid-template-columns: 1fr;
    }

    #icve-tabbed-panel .config-row-title {
        padding-top: 0;
    }

    #icve-tabbed-panel .field-full {
        grid-column: auto;
    }

    #icve-tabbed-panel .config-actions,
    #icve-tabbed-panel .config-action-row {
        grid-template-columns: repeat(2, minmax(0, 1fr));
    }

}
`;
