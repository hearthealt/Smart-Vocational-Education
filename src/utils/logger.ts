/**
 * 日志系统
 */

import type { LogType, LogEntry } from '../types/index';

interface LogEntryInternal extends LogEntry {
    id: number;
}

interface LoggerInterface {
    _prefix: string;
    _maxLogs: number;
    _logs: LogEntryInternal[];
    _log(level: LogType, ...args: unknown[]): void;
    _addPageLog(level: LogType, timestamp: string, args: unknown[]): void;
    _updatePageLog(logEntry: LogEntryInternal): void;
    _createLogElement(logEntry: LogEntryInternal): HTMLDivElement;
    _getLogIcon(level: LogType): string;
    clearPageLog(): void;
    exportLogs(): string;
    downloadLogs(): void;
    filterLogs(type: LogType | 'all'): void;
    searchLogs(keyword: string): void;
    info(...args: unknown[]): void;
    success(...args: unknown[]): void;
    warn(...args: unknown[]): void;
    error(...args: unknown[]): void;
}

export const Logger: LoggerInterface = {
    _prefix: '[智慧职教助手]',
    _maxLogs: 100,
    _logs: [],

    _log(level: LogType, ...args: unknown[]): void {
        const timestamp = new Date().toLocaleTimeString();
        this._addPageLog(level, timestamp, args);
    },

    _addPageLog(level: LogType, timestamp: string, args: unknown[]): void {
        const message = args.map(arg =>
            typeof arg === 'object' ? JSON.stringify(arg) : String(arg)
        ).join(' ');

        const logEntry: LogEntryInternal = {
            type: level,
            time: timestamp,
            message,
            id: Date.now() + Math.random()
        };

        this._logs.push(logEntry);

        if (this._logs.length > this._maxLogs) {
            this._logs.shift();
        }

        this._updatePageLog(logEntry);

        if (typeof window.updateLogCount === 'function') {
            window.updateLogCount();
        }
    },

    _updatePageLog(logEntry: LogEntryInternal): void {
        const container = document.getElementById('page-log-container');
        if (!container) return;

        const placeholder = container.querySelector('.log-placeholder');
        if (placeholder) {
            placeholder.remove();
        }

        const logElement = this._createLogElement(logEntry);
        container.appendChild(logElement);

        while (container.children.length > this._maxLogs) {
            if (container.firstChild) {
                container.removeChild(container.firstChild);
            }
        }

        container.scrollTop = container.scrollHeight;
    },

    _createLogElement(logEntry: LogEntryInternal): HTMLDivElement {
        const div = document.createElement('div');
        div.className = `log-entry log-${logEntry.type}`;
        div.dataset.type = logEntry.type;
        div.dataset.message = logEntry.message.toLowerCase();
        div.innerHTML = `
            <span class="log-time">${logEntry.time}</span>
            <span class="log-icon">${this._getLogIcon(logEntry.type)}</span>
            <span class="log-message">${logEntry.message}</span>
        `;
        return div;
    },

    _getLogIcon(level: LogType): string {
        const icons: Record<LogType, string> = {
            info: 'ℹ️',
            success: '✅',
            warn: '⚠️',
            error: '❌'
        };
        return icons[level] || 'ℹ️';
    },

    clearPageLog(): void {
        this._logs = [];
        const container = document.getElementById('page-log-container');
        if (container) {
            container.innerHTML = '<div class="log-placeholder">暂无日志记录</div>';
        }
        if (typeof window.updateLogCount === 'function') {
            window.updateLogCount();
        }
    },

    /**
     * 导出日志为文本
     */
    exportLogs(): string {
        const header = `智慧职教助手 - 日志导出\n导出时间: ${new Date().toLocaleString()}\n共 ${this._logs.length} 条记录\n${'='.repeat(50)}\n\n`;

        const logContent = this._logs.map(log => {
            const typeLabel = {
                info: '[信息]',
                success: '[成功]',
                warn: '[警告]',
                error: '[错误]'
            }[log.type] || '[未知]';
            return `${log.time} ${typeLabel} ${log.message}`;
        }).join('\n');

        return header + logContent;
    },

    /**
     * 下载日志文件
     */
    downloadLogs(): void {
        const content = this.exportLogs();
        const blob = new Blob([content], { type: 'text/plain;charset=utf-8' });
        const url = URL.createObjectURL(blob);

        const a = document.createElement('a');
        a.href = url;
        a.download = `icve-helper-logs-${new Date().toISOString().slice(0, 10)}.txt`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);

        this.success('日志已导出');
    },

    /**
     * 按类型筛选日志
     */
    filterLogs(type: LogType | 'all'): void {
        const container = document.getElementById('page-log-container');
        if (!container) return;

        const entries = container.querySelectorAll('.log-entry');
        let visibleCount = 0;

        entries.forEach(entry => {
            const entryType = (entry as HTMLElement).dataset.type;
            if (type === 'all' || entryType === type) {
                entry.classList.remove('filtered');
                visibleCount++;
            } else {
                entry.classList.add('filtered');
            }
        });

        // 更新计数
        const countEl = document.getElementById('log-count');
        if (countEl) {
            if (type === 'all') {
                countEl.textContent = `${this._logs.length} 条记录`;
            } else {
                countEl.textContent = `${visibleCount} / ${this._logs.length} 条记录`;
            }
        }

        // 显示无结果提示
        const noResults = container.querySelector('.log-no-results');
        if (visibleCount === 0 && this._logs.length > 0) {
            if (!noResults) {
                const tip = document.createElement('div');
                tip.className = 'log-no-results';
                tip.textContent = '没有匹配的日志';
                container.appendChild(tip);
            }
        } else if (noResults) {
            noResults.remove();
        }
    },

    /**
     * 搜索日志
     */
    searchLogs(keyword: string): void {
        const container = document.getElementById('page-log-container');
        if (!container) return;

        const entries = container.querySelectorAll('.log-entry');
        const lowerKeyword = keyword.toLowerCase().trim();
        let visibleCount = 0;

        entries.forEach(entry => {
            const message = (entry as HTMLElement).dataset.message || '';
            const isFiltered = entry.classList.contains('filtered');

            if (!isFiltered) {
                if (!lowerKeyword || message.includes(lowerKeyword)) {
                    entry.classList.remove('search-hidden');
                    if (lowerKeyword) {
                        entry.classList.add('highlight');
                    } else {
                        entry.classList.remove('highlight');
                    }
                    visibleCount++;
                } else {
                    entry.classList.add('search-hidden');
                    entry.classList.remove('highlight');
                }
            }
        });

        // 添加搜索隐藏样式
        const style = document.getElementById('log-search-style');
        if (!style) {
            const styleEl = document.createElement('style');
            styleEl.id = 'log-search-style';
            styleEl.textContent = '.log-entry.search-hidden { display: none; }';
            document.head.appendChild(styleEl);
        }
    },

    info(...args: unknown[]): void { this._log('info', ...args); },
    success(...args: unknown[]): void { this._log('success', ...args); },
    warn(...args: unknown[]): void { this._log('warn', ...args); },
    error(...args: unknown[]): void { this._log('error', ...args); }
};

export default Logger;
