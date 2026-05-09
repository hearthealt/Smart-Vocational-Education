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
    setText(id: string, text: string): boolean;
    setStyle(id: string, styles: Partial<CSSStyleDeclaration>): boolean;
    cleanup(): void;
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

};

// 定期清理过期缓存（每 30 秒）
setInterval(() => {
    DOMCache.cleanup();
}, 30000);

export default DOMCache;
