/**
 * 统一错误处理模块
 */

import { Logger } from './logger';
import { ErrorType } from '../types/index';

/**
 * 应用错误类
 */
export class AppError extends Error {
    type: ErrorType;
    cause: Error | null;
    context: Record<string, unknown>;
    timestamp: string;

    constructor(
        message: string,
        type: ErrorType = ErrorType.UNKNOWN,
        cause: Error | null = null,
        context: Record<string, unknown> = {}
    ) {
        super(message);
        this.name = 'AppError';
        this.type = type;
        this.cause = cause;
        this.context = context;
        this.timestamp = new Date().toISOString();
    }

    /**
     * 获取用户友好的错误消息
     */
    getUserMessage(): string {
        const messages: Record<ErrorType, string> = {
            [ErrorType.NETWORK]: '网络连接失败，请检查网络后重试',
            [ErrorType.API]: 'API 请求失败，请检查配置',
            [ErrorType.PARSE]: '数据解析失败',
            [ErrorType.DOM]: '页面元素加载异常，请刷新页面',
            [ErrorType.CONFIG]: '配置错误，请检查设置',
            [ErrorType.TIMEOUT]: '操作超时，请重试',
            [ErrorType.VALIDATION]: '输入验证失败',
            [ErrorType.UNKNOWN]: '发生未知错误'
        };
        return messages[this.type] || this.message;
    }
}

/**
 * 错误处理器
 */
export const ErrorHandler = {
    /**
     * 处理错误并记录日志
     */
    handle(error: Error | AppError, context: string = '', silent: boolean = false): AppError {
        const appError = this.normalize(error, context);

        Logger.error(`[${appError.type}] ${context ? context + ': ' : ''}${appError.message}`);

        if (this._isDebugMode()) {
            console.error('[ICVE Helper Error]', {
                type: appError.type,
                message: appError.message,
                context: appError.context,
                cause: appError.cause,
                stack: appError.stack
            });
        }

        if (!silent) {
            this._showUserNotification(appError);
        }

        return appError;
    },

    /**
     * 将普通错误转换为 AppError
     */
    normalize(error: Error, context: string = ''): AppError {
        if (error instanceof AppError) {
            return error;
        }

        let type = ErrorType.UNKNOWN;
        let message = error.message || '未知错误';

        if (error.name === 'TypeError' && message.includes('fetch')) {
            type = ErrorType.NETWORK;
            message = '网络请求失败';
        } else if (error.name === 'SyntaxError' || message.includes('JSON')) {
            type = ErrorType.PARSE;
            message = 'JSON 解析失败';
        } else if (message.includes('timeout') || message.includes('超时')) {
            type = ErrorType.TIMEOUT;
        } else if (message.includes('API') || message.includes('401') || message.includes('403')) {
            type = ErrorType.API;
        } else if (error.name === 'TypeError' && (message.includes('null') || message.includes('undefined'))) {
            type = ErrorType.DOM;
        }

        return new AppError(message, type, error, { originalContext: context });
    },

    /**
     * 创建 API 错误
     */
    createAPIError(status: number, message: string = ''): AppError {
        const statusMessages: Record<number, string> = {
            400: '请求参数错误',
            401: 'API Key 无效或已过期',
            403: '没有访问权限',
            404: 'API 地址不存在',
            429: '请求过于频繁，请稍后重试',
            500: 'API 服务器内部错误',
            502: 'API 网关错误',
            503: 'API 服务暂时不可用'
        };

        const errorMessage = message || statusMessages[status] || `API 错误 (${status})`;
        return new AppError(errorMessage, ErrorType.API, null, { status });
    },

    /**
     * 创建网络错误
     */
    createNetworkError(message: string = '网络连接失败'): AppError {
        return new AppError(message, ErrorType.NETWORK);
    },

    /**
     * 创建超时错误
     */
    createTimeoutError(timeout?: number): AppError {
        const message = timeout ? `请求超时（${timeout / 1000}秒）` : '请求超时';
        return new AppError(message, ErrorType.TIMEOUT, null, { timeout });
    },

    /**
     * 安全执行函数，捕获错误
     */
    safeExecute<T>(fn: () => T, defaultValue: T | null = null, context: string = ''): T | null {
        try {
            return fn();
        } catch (error) {
            this.handle(error as Error, context, true);
            return defaultValue;
        }
    },

    /**
     * 安全执行异步函数
     */
    async safeExecuteAsync<T>(fn: () => Promise<T>, defaultValue: T | null = null, context: string = ''): Promise<T | null> {
        try {
            return await fn();
        } catch (error) {
            this.handle(error as Error, context, true);
            return defaultValue;
        }
    },

    /**
     * 检查是否是调试模式
     */
    _isDebugMode(): boolean {
        return localStorage.getItem('icve_debug_mode') === 'true';
    },

    /**
     * 显示用户通知
     */
    _showUserNotification(error: AppError): void {
        const examMessage = document.getElementById('exam-message');
        const learningProgressText = document.getElementById('learning-progress-text');

        const userMessage = `❌ ${error.getUserMessage()}`;

        if (examMessage) {
            examMessage.textContent = userMessage;
            examMessage.style.color = '#ef4444';
        }

        if (learningProgressText) {
            learningProgressText.textContent = userMessage;
        }
    }
};

export { ErrorType };
export default ErrorHandler;
