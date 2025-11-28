/**
 * 日志系统
 */
export const Logger = {
    _prefix: '[智慧职教助手]',
    _maxLogs: 100, // 最大日志条数
    _logs: [], // 存储日志数据

    _log(level, ...args) {
        const timestamp = new Date().toLocaleTimeString();

        // 添加到页面日志
        this._addPageLog(level, timestamp, args);
    },

    _addPageLog(level, timestamp, args) {
        const message = args.map(arg =>
            typeof arg === 'object' ? JSON.stringify(arg) : String(arg)
        ).join(' ');

        const logEntry = {
            level,
            timestamp,
            message,
            id: Date.now() + Math.random()
        };

        this._logs.push(logEntry);

        // 限制日志数量
        if (this._logs.length > this._maxLogs) {
            this._logs.shift();
        }

        // 更新页面日志显示
        this._updatePageLog(logEntry);

        // 更新日志计数器
        if (typeof updateLogCount === 'function') {
            updateLogCount();
        }
    },

    _updatePageLog(logEntry) {
        const container = document.getElementById('page-log-container');
        if (!container) return;

        // 移除占位符（如果存在）
        const placeholder = container.querySelector('.log-placeholder');
        if (placeholder) {
            placeholder.remove();
        }

        const logElement = this._createLogElement(logEntry);
        container.appendChild(logElement);

        // 限制DOM中的日志数量
        while (container.children.length > this._maxLogs) {
            container.removeChild(container.firstChild);
        }

        // 自动滚动到底部
        container.scrollTop = container.scrollHeight;
    },

    _createLogElement(logEntry) {
        const div = document.createElement('div');
        div.className = `log-entry log-${logEntry.level}`;
        div.innerHTML = `
            <span class="log-time">${logEntry.timestamp}</span>
            <span class="log-icon">${this._getLogIcon(logEntry.level)}</span>
            <span class="log-message">${logEntry.message}</span>
        `;
        return div;
    },

    _getLogIcon(level) {
        const icons = {
            info: 'ℹ️',
            success: '✅',
            warn: '⚠️',
            error: '❌'
        };
        return icons[level] || 'ℹ️';
    },

    clearPageLog() {
        this._logs = [];
        const container = document.getElementById('page-log-container');
        if (container) {
            container.innerHTML = '<div class="log-placeholder">暂无日志记录</div>';
        }
        if (typeof updateLogCount === 'function') {
            updateLogCount();
        }
    },

    info(...args) { this._log('info', ...args); },
    success(...args) { this._log('success', ...args); },
    warn(...args) { this._log('warn', ...args); },
    error(...args) { this._log('error', ...args); }
};
