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
    clearPageLog(): void;
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

        if (typeof window.updateRecentEvents === 'function') {
            window.updateRecentEvents();
        }
    },

    clearPageLog(): void {
        this._logs = [];
        if (typeof window.updateRecentEvents === 'function') {
            window.updateRecentEvents();
        }
    },

    info(...args: unknown[]): void { this._log('info', ...args); },
    success(...args: unknown[]): void { this._log('success', ...args); },
    warn(...args: unknown[]): void { this._log('warn', ...args); },
    error(...args: unknown[]): void { this._log('error', ...args); }
};

export default Logger;
