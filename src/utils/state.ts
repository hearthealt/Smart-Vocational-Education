/**
 * 响应式状态管理模块
 */

import { ConfigManager } from './config';
import type { AppState } from '../types/index';

/**
 * 响应式状态管理器
 */
class ReactiveStateManager {
    private _state: AppState | null = null;
    private _initialized: boolean = false;

    /**
     * 初始化状态
     */
    init(): AppState {
        if (this._initialized && this._state) {
            return this._state;
        }

        const initialState: AppState = {
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
            exam: {
                isRunning: false,
                currentQuestionIndex: 0,
                totalQuestions: 0,
            }
        };

        this._state = initialState;
        this._initialized = true;

        return this._state;
    }
}

const stateManager = new ReactiveStateManager();

export const state: AppState = stateManager.init();

/**
 * 保存学习进度数据
 */
export function saveLearningProgress(): void {
    GM_setValue(ConfigManager.keys.progress.processedNodes, Array.from(state.learning.processedNodes));
    GM_setValue(ConfigManager.keys.progress.completedChapters, Array.from(state.learning.completedChapters));
}

/**
 * 加载学习进度数据
 */
export function loadLearningProgress(): void {
    const processedNodes = GM_getValue<string[]>(ConfigManager.keys.progress.processedNodes, []);
    const completedChapters = GM_getValue<string[]>(ConfigManager.keys.progress.completedChapters, []);

    state.learning.processedNodes = new Set(processedNodes);
    state.learning.completedChapters = new Set(completedChapters);
}

export default stateManager;
