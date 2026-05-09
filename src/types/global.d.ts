/**
 * 油猴脚本全局类型定义
 */

// GM_* 函数类型定义
declare function GM_getValue<T>(key: string, defaultValue?: T): T;
declare function GM_setValue(key: string, value: unknown): void;

interface GM_XHR_Response {
    status: number;
    statusText: string;
    responseText: string;
    responseHeaders: string;
    finalUrl: string;
}

interface GM_XHR_Options {
    method?: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH' | 'HEAD';
    url: string;
    headers?: Record<string, string>;
    data?: string | FormData;
    timeout?: number;
    onload?: (response: GM_XHR_Response) => void;
    onerror?: (error: Error) => void;
    ontimeout?: () => void;
    onprogress?: (progress: { loaded: number; total: number }) => void;
}

declare function GM_xmlhttpRequest(options: GM_XHR_Options): { abort: () => void };

// 扩展 Window 接口
interface Window {
    updateRecentEvents?: () => void;
}
