/**
 * 工具函数模块
 */
export const Utils = {
    // 延时函数
    sleep: (ms) => new Promise(resolve => setTimeout(resolve, ms)),

    // 格式化时间（秒转为 MM:SS 格式）
    formatTime: (seconds) => {
        if (!seconds || isNaN(seconds) || seconds === Infinity) return '0:00';
        const mins = Math.floor(seconds / 60);
        const secs = Math.floor(seconds % 60);
        return `${mins}:${secs.toString().padStart(2, '0')}`;
    },

    // 防抖函数
    debounce: (fn, delay = 300) => {
        let timer = null;
        return function(...args) {
            if (timer) clearTimeout(timer);
            timer = setTimeout(() => fn.apply(this, args), delay);
        };
    },

    // 节流函数
    throttle: (fn, delay = 300) => {
        let lastTime = 0;
        return function(...args) {
            const now = Date.now();
            if (now - lastTime >= delay) {
                lastTime = now;
                return fn.apply(this, args);
            }
        };
    },

    // 安全获取DOM元素
    $(selector, parent = document) {
        return parent.querySelector(selector);
    },

    // 安全获取多个DOM元素
    $$(selector, parent = document) {
        return Array.from(parent.querySelectorAll(selector));
    },

    // 带重试的异步操作
    async retry(fn, maxRetries = 3, delay = 1000) {
        for (let i = 0; i < maxRetries; i++) {
            try {
                return await fn();
            } catch (error) {
                if (i === maxRetries - 1) throw error;
                await this.sleep(delay);
            }
        }
    }
};
