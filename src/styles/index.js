/**
 * 样式主入口 - 注入当前重构版工作台样式
 */

import { refactorStyles } from './refactor.js';

/**
 * 添加样式到页面
 */
export function addStyles() {
    const style = document.createElement('style');
    style.id = 'icve-helper-styles';

    style.textContent = refactorStyles;

    document.head.appendChild(style);
}

/**
 * 移除样式（用于热重载或清理）
 */
export function removeStyles() {
    const existingStyle = document.getElementById('icve-helper-styles');
    if (existingStyle) {
        existingStyle.remove();
    }
}

/**
 * 重新加载样式（用于开发调试）
 */
export function reloadStyles() {
    removeStyles();
    addStyles();
}
