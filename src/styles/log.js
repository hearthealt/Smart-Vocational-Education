/**
 * 日志面板样式
 */
export const logStyles = `
/* ==================== 日志标签页容器 ==================== */
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
    font-family: 'JetBrains Mono', 'SF Mono', 'Consolas', monospace;
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
    background: linear-gradient(180deg, var(--icve-primary-from), var(--icve-primary-to));
    border-radius: 3px;
}

/* 小屏幕日志容器 */
@media (max-width: 480px) {
    .log-tab-container {
        max-height: calc(85vh - 120px);
    }

    .log-container {
        padding: 10px;
        font-size: 11px;
        min-height: 200px;
    }
}

/* ==================== 日志底栏 ==================== */
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

/* 小屏幕底栏 */
@media (max-width: 480px) {
    .log-footer {
        padding: 10px 12px;
    }

    .log-count-text {
        font-size: 12px;
    }

    .btn-clear-log {
        height: 30px;
        padding: 0 12px;
        font-size: 12px;
    }
}

/* ==================== 日志条目 ==================== */
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
    flex-shrink: 0;
}

.log-icon {
    font-size: 14px;
    line-height: 1;
    flex-shrink: 0;
}

.log-message {
    flex: 1;
    color: var(--icve-text-primary);
    word-break: break-word;
    line-height: 1.4;
}

/* 小屏幕日志条目 */
@media (max-width: 480px) {
    .log-entry {
        gap: 6px;
        padding: 6px 0;
    }

    .log-time {
        min-width: 55px;
        font-size: 10px;
    }

    .log-icon {
        font-size: 12px;
    }
}

/* 日志类型颜色 */
.log-info .log-icon { color: var(--icve-info-from); }
.log-success .log-icon { color: var(--icve-success-from); }
.log-warn .log-icon { color: var(--icve-warning-from); }
.log-error .log-icon { color: var(--icve-danger-from); }

.log-info .log-message { color: var(--icve-text-primary); }
.log-success .log-message { color: var(--icve-success-from); }
.log-warn .log-message { color: var(--icve-warning-from); }
.log-error .log-message { color: var(--icve-danger-from); font-weight: 600; }

/* 日志占位符 */
.log-placeholder {
    text-align: center;
    color: var(--icve-text-tertiary);
    padding: 40px 20px;
    font-style: italic;
}

/* 小屏幕占位符 */
@media (max-width: 480px) {
    .log-placeholder {
        padding: 30px 16px;
        font-size: 12px;
    }
}
`;
