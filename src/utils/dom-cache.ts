/**
 * 增强版 DOM 元素缓存模块
 */

import type { DOMCacheItem } from '../types/index';

interface DOMCacheInterface {
    _cache: Map<string, DOMCacheItem>;
    _idCache: Map<string, HTMLElement>;
    _maxAge: number;
    _debug: boolean;
    get(selector: string, forceRefresh?: boolean): HTMLElement | null;
    getById(id: string, forceRefresh?: boolean): HTMLElement | null;
    getMultiple(selectors: Record<string, string>): Record<string, HTMLElement | null>;
    getAll(selector: string): HTMLElement[];
    setText(id: string, text: string): boolean;
    setHTML(id: string, html: string): boolean;
    setStyle(id: string, styles: Partial<CSSStyleDeclaration>): boolean;
    toggleClass(id: string, className: string, force?: boolean): boolean;
    setAttribute(id: string, attr: string, value: string): boolean;
    setDisabled(id: string, disabled: boolean): boolean;
    invalidate(selector: string): void;
    invalidateById(id: string): void;
    clear(): void;
    cleanup(): void;
    setMaxAge(ms: number): void;
    setDebug(enabled: boolean): void;
    getStats(): { selectorCacheSize: number; idCacheSize: number };
}

/**
 * DOM 缓存管理器
 */
export const DOMCache: DOMCacheInterface = {
    _cache: new Map<string, DOMCacheItem>(),
    _idCache: new Map<string, HTMLElement>(),
    _maxAge: 5000,
    _debug: false,

    /**
     * 通过选择器获取元素（带缓存）
     */
    get(selector: string, forceRefresh: boolean = false): HTMLElement | null {
        const now = Date.now();
        const cached = this._cache.get(selector);

        if (!forceRefresh && cached && (now - cached.time < this._maxAge)) {
            if (this._debug) {
                console.log(`[DOMCache] Hit: ${selector}`);
            }
            if (cached.element && document.contains(cached.element)) {
                return cached.element;
            }
        }

        const element = document.querySelector(selector) as HTMLElement | null;
        this._cache.set(selector, { element, time: now });

        if (this._debug) {
            console.log(`[DOMCache] Miss: ${selector}`, element ? 'found' : 'not found');
        }

        return element;
    },

    /**
     * 通过 ID 获取元素（永久缓存）
     */
    getById(id: string, forceRefresh: boolean = false): HTMLElement | null {
        if (!forceRefresh && this._idCache.has(id)) {
            const cached = this._idCache.get(id)!;
            if (document.contains(cached)) {
                return cached;
            }
        }

        const element = document.getElementById(id);
        if (element) {
            this._idCache.set(id, element);
        } else {
            this._idCache.delete(id);
        }

        return element;
    },

    /**
     * 批量获取多个元素
     */
    getMultiple(selectors: Record<string, string>): Record<string, HTMLElement | null> {
        const result: Record<string, HTMLElement | null> = {};
        for (const [name, selector] of Object.entries(selectors)) {
            result[name] = selector.startsWith('#')
                ? this.getById(selector.slice(1))
                : this.get(selector);
        }
        return result;
    },

    /**
     * 通过选择器获取所有匹配元素
     */
    getAll(selector: string): HTMLElement[] {
        return Array.from(document.querySelectorAll(selector)) as HTMLElement[];
    },

    /**
     * 安全设置元素文本内容
     */
    setText(id: string, text: string): boolean {
        const element = this.getById(id);
        if (element) {
            element.textContent = text;
            return true;
        }
        return false;
    },

    /**
     * 安全设置元素 HTML 内容
     */
    setHTML(id: string, html: string): boolean {
        const element = this.getById(id);
        if (element) {
            element.innerHTML = html;
            return true;
        }
        return false;
    },

    /**
     * 安全设置元素样式
     */
    setStyle(id: string, styles: Partial<CSSStyleDeclaration>): boolean {
        const element = this.getById(id);
        if (element) {
            Object.assign(element.style, styles);
            return true;
        }
        return false;
    },

    /**
     * 安全切换元素类名
     */
    toggleClass(id: string, className: string, force?: boolean): boolean {
        const element = this.getById(id);
        if (element) {
            element.classList.toggle(className, force);
            return true;
        }
        return false;
    },

    /**
     * 安全设置元素属性
     */
    setAttribute(id: string, attr: string, value: string): boolean {
        const element = this.getById(id);
        if (element) {
            element.setAttribute(attr, value);
            return true;
        }
        return false;
    },

    /**
     * 安全设置元素禁用状态
     */
    setDisabled(id: string, disabled: boolean): boolean {
        const element = this.getById(id) as HTMLButtonElement | HTMLInputElement | null;
        if (element && 'disabled' in element) {
            element.disabled = disabled;
            return true;
        }
        return false;
    },

    /**
     * 清除指定选择器的缓存
     */
    invalidate(selector: string): void {
        this._cache.delete(selector);
    },

    /**
     * 清除指定 ID 的缓存
     */
    invalidateById(id: string): void {
        this._idCache.delete(id);
    },

    /**
     * 清除所有缓存
     */
    clear(): void {
        this._cache.clear();
        this._idCache.clear();
    },

    /**
     * 清除过期缓存
     */
    cleanup(): void {
        const now = Date.now();
        for (const [selector, cached] of this._cache.entries()) {
            if (now - cached.time >= this._maxAge) {
                this._cache.delete(selector);
            }
        }
    },

    /**
     * 设置缓存过期时间
     */
    setMaxAge(ms: number): void {
        this._maxAge = ms;
    },

    /**
     * 启用或禁用调试模式
     */
    setDebug(enabled: boolean): void {
        this._debug = enabled;
    },

    /**
     * 获取缓存统计信息
     */
    getStats(): { selectorCacheSize: number; idCacheSize: number } {
        return {
            selectorCacheSize: this._cache.size,
            idCacheSize: this._idCache.size
        };
    }
};

// 定期清理过期缓存（每 30 秒）
setInterval(() => {
    DOMCache.cleanup();
}, 30000);

export default DOMCache;
