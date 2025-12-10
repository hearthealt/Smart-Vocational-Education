/**
 * 样式主入口 - 整合所有模块化CSS
 *
 * 模块结构：
 * - variables.js  : CSS变量定义（颜色、间距、动画等设计令牌）
 * - base.js       : 基础样式（面板容器、头部、标签页导航）
 * - components.js : 通用组件（按钮、输入框、卡片、开关等）
 * - learning.js   : 学习页面专属样式
 * - exam.js       : 答题页面专属样式
 * - log.js        : 日志面板样式
 * - dark-theme.js : 深色主题覆盖样式
 * - legacy.js     : 兼容旧版选择器的样式
 */

import { cssVariables } from './variables.js';
import { baseStyles } from './base.js';
import { componentStyles } from './components.js';
import { learningStyles } from './learning.js';
import { examStyles } from './exam.js';
import { logStyles } from './log.js';
import { darkThemeStyles } from './dark-theme.js';
import { legacyStyles } from './legacy.js';

/**
 * 添加所有样式到页面
 */
export function addStyles() {
    const style = document.createElement('style');
    style.id = 'icve-helper-styles';

    // 按顺序组合所有样式模块
    style.textContent = [
        cssVariables,
        baseStyles,
        componentStyles,
        learningStyles,
        examStyles,
        logStyles,
        darkThemeStyles,
        legacyStyles
    ].join('\n');

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
