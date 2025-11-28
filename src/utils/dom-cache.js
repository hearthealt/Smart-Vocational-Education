/**
 * DOM元素缓存
 */
export const DOMCache = {
    _cache: new Map(),
    _maxAge: 5000, // 缓存5秒

    get(selector, forceRefresh = false) {
        const now = Date.now();
        const cached = this._cache.get(selector);

        if (!forceRefresh && cached && (now - cached.time < this._maxAge)) {
            return cached.element;
        }

        const element = document.querySelector(selector);
        if (element) {
            this._cache.set(selector, { element, time: now });
        }
        return element;
    }
};
