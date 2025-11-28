import { ConfigManager } from '../utils/config.js';

/**
 * 全局状态管理
 */
export const state = {
    // 学习模式状态
    learning: {
        isRunning: false,
        currentNode: null,
        allNodes: [],
        completedCount: 0,
        totalCount: 0,
        examCount: 0,
        processedNodes: new Set(GM_getValue(ConfigManager.keys.progress.processedNodes, [])),
        completedChapters: new Set(GM_getValue(ConfigManager.keys.progress.completedChapters, [])),
        currentPage: 1,
        totalPages: 1,
        isDocument: false,
        mediaWatching: false
    },
    // 答题模式状态
    exam: {
        isRunning: false,
        currentQuestionIndex: 0,
        totalQuestions: 0,
    }
};

/**
 * 保存学习进度数据
 */
export function saveLearningProgress() {
    GM_setValue(ConfigManager.keys.progress.processedNodes, Array.from(state.learning.processedNodes));
    GM_setValue(ConfigManager.keys.progress.completedChapters, Array.from(state.learning.completedChapters));
}

/**
 * 加载学习进度数据
 */
export function loadLearningProgress() {
    const processedNodes = GM_getValue(ConfigManager.keys.progress.processedNodes, []);
    const completedChapters = GM_getValue(ConfigManager.keys.progress.completedChapters, []);

    state.learning.processedNodes = new Set(processedNodes);
    state.learning.completedChapters = new Set(completedChapters);
}
