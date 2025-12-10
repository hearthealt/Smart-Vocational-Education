/**
 * 工具函数模块
 */

export const Utils = {
    /**
     * 延时函数
     * @param ms - 延时毫秒数
     */
    sleep(ms: number): Promise<void> {
        return new Promise(resolve => setTimeout(resolve, ms));
    },

    /**
     * 格式化时间（秒转为 MM:SS 格式）
     * @param seconds - 秒数
     */
    formatTime(seconds: number): string {
        if (!seconds || isNaN(seconds) || seconds === Infinity) return '0:00';
        const mins = Math.floor(seconds / 60);
        const secs = Math.floor(seconds % 60);
        return `${mins}:${secs.toString().padStart(2, '0')}`;
    },

    /**
     * 防抖函数
     * @param fn - 要防抖的函数
     * @param delay - 延时毫秒数
     */
    debounce<T extends (...args: never[]) => unknown>(fn: T, delay: number = 300): (...args: Parameters<T>) => void {
        let timer: ReturnType<typeof setTimeout> | null = null;
        return function(this: unknown, ...args: Parameters<T>): void {
            if (timer) clearTimeout(timer);
            timer = setTimeout(() => fn.apply(this, args), delay);
        };
    },

    /**
     * 节流函数
     * @param fn - 要节流的函数
     * @param delay - 间隔毫秒数
     */
    throttle<T extends (...args: never[]) => unknown>(fn: T, delay: number = 300): (...args: Parameters<T>) => ReturnType<T> | undefined {
        let lastTime = 0;
        return function(this: unknown, ...args: Parameters<T>): ReturnType<T> | undefined {
            const now = Date.now();
            if (now - lastTime >= delay) {
                lastTime = now;
                return fn.apply(this, args) as ReturnType<T>;
            }
            return undefined;
        };
    },

    /**
     * 安全获取单个 DOM 元素
     * @param selector - CSS 选择器
     * @param parent - 父元素
     */
    $(selector: string, parent: ParentNode = document): Element | null {
        return parent.querySelector(selector);
    },

    /**
     * 安全获取多个 DOM 元素
     * @param selector - CSS 选择器
     * @param parent - 父元素
     */
    $$(selector: string, parent: ParentNode = document): Element[] {
        return Array.from(parent.querySelectorAll(selector));
    },

    /**
     * 带重试的异步操作
     * @param fn - 要执行的异步函数
     * @param maxRetries - 最大重试次数
     * @param delay - 重试间隔毫秒数
     */
    async retry<T>(fn: () => Promise<T>, maxRetries: number = 3, delay: number = 1000): Promise<T> {
        for (let i = 0; i < maxRetries; i++) {
            try {
                return await fn();
            } catch (error) {
                if (i === maxRetries - 1) throw error;
                await this.sleep(delay);
            }
        }
        throw new Error('Retry failed');
    },

    /**
     * 更新进度条（带智能标签定位）
     * @param progressBarId - 进度条元素 ID
     * @param percentage - 百分比 (0-100)
     */
    updateProgressBar(progressBarId: string, percentage: number): void {
        const progressBar = document.getElementById(progressBarId);
        if (!progressBar) return;

        // 确保百分比在有效范围内
        percentage = Math.max(0, Math.min(100, percentage));
        const roundedPercentage = Math.round(percentage);

        // 更新宽度和 data-progress 属性
        progressBar.style.width = `${percentage}%`;
        progressBar.setAttribute('data-progress', `${roundedPercentage}%`);

        // 智能切换标签位置：进度 > 70% 时标签显示在内部
        if (percentage > 70) {
            progressBar.classList.add('progress-label-inside');
        } else {
            progressBar.classList.remove('progress-label-inside');
        }
    },

    /**
     * 重置进度条
     * @param progressBarId - 进度条元素 ID
     */
    resetProgressBar(progressBarId: string): void {
        const progressBar = document.getElementById(progressBarId);
        if (!progressBar) return;

        progressBar.style.width = '0%';
        progressBar.setAttribute('data-progress', '0%');
        progressBar.classList.remove('progress-label-inside');
    }
};

export default Utils;
