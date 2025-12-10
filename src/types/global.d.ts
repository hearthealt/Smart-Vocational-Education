/**
 * 油猴脚本全局类型定义
 */

// GM_* 函数类型定义
declare function GM_getValue<T>(key: string, defaultValue?: T): T;
declare function GM_setValue(key: string, value: unknown): void;
declare function GM_deleteValue(key: string): void;
declare function GM_listValues(): string[];

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

declare function GM_addStyle(css: string): HTMLStyleElement;
declare function GM_getResourceText(name: string): string;
declare function GM_getResourceURL(name: string): string;

declare function GM_openInTab(url: string, options?: { active?: boolean; insert?: boolean; setParent?: boolean }): { close: () => void };
declare function GM_setClipboard(data: string, info?: string | { type?: string; mimetype?: string }): void;
declare function GM_notification(options: {
    text: string;
    title?: string;
    image?: string;
    highlight?: boolean;
    silent?: boolean;
    timeout?: number;
    onclick?: () => void;
    ondone?: () => void;
}): void;

declare function GM_registerMenuCommand(name: string, callback: () => void, accessKey?: string): number;
declare function GM_unregisterMenuCommand(menuCmdId: number): void;

// GM_info 对象
declare const GM_info: {
    script: {
        name: string;
        namespace: string;
        description: string;
        version: string;
        author: string;
        homepage: string;
        icon: string;
        icon64: string;
        grant: string[];
        matches: string[];
        includes: string[];
        excludes: string[];
        resources: Record<string, string>;
        'run-at': string;
    };
    scriptHandler: string;
    version: string;
};

// unsafeWindow
declare const unsafeWindow: Window & typeof globalThis;

// 扩展 Window 接口
interface Window {
    updateLogCount?: () => void;
}
