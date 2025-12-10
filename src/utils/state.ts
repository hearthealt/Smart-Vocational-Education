/**
 * 响应式状态管理模块
 */

import { ConfigManager } from './config';
import type { AppState, LearningState, ExamState, StateListener } from '../types/index';

/**
 * 响应式状态管理器
 */
class ReactiveStateManager {
    private _listeners: Map<string, Set<StateListener>> = new Map();
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

        this._state = this._createReactiveObject(initialState, '') as AppState;
        this._initialized = true;

        return this._state;
    }

    /**
     * 创建响应式对象
     */
    private _createReactiveObject<T extends object>(obj: T, path: string): T {
        if (obj === null || typeof obj !== 'object' || obj instanceof Set || obj instanceof Map) {
            return obj;
        }

        const self = this;

        for (const key in obj) {
            if (Object.prototype.hasOwnProperty.call(obj, key)) {
                const value = obj[key];
                if (typeof value === 'object' && value !== null && !(value instanceof Set) && !(value instanceof Map)) {
                    (obj as Record<string, unknown>)[key] = this._createReactiveObject(
                        value as object,
                        path ? `${path}.${key}` : key
                    );
                }
            }
        }

        return new Proxy(obj, {
            set(target: T, property: string | symbol, value: unknown): boolean {
                const oldValue = (target as Record<string | symbol, unknown>)[property];

                if (oldValue === value) {
                    return true;
                }

                if (typeof value === 'object' && value !== null && !(value instanceof Set) && !(value instanceof Map)) {
                    value = self._createReactiveObject(
                        value as object,
                        path ? `${path}.${String(property)}` : String(property)
                    );
                }

                (target as Record<string | symbol, unknown>)[property] = value;

                const fullPath = path ? `${path}.${String(property)}` : String(property);
                self._notify(fullPath, value, oldValue);

                return true;
            },

            get(target: T, property: string | symbol): unknown {
                return (target as Record<string | symbol, unknown>)[property];
            }
        });
    }

    /**
     * 通知所有相关监听器
     */
    private _notify(path: string, newValue: unknown, oldValue: unknown): void {
        const listeners = this._listeners.get(path);
        if (listeners) {
            listeners.forEach(listener => {
                try {
                    listener(path, newValue, oldValue);
                } catch (e) {
                    console.error('[ReactiveState] Listener error:', e);
                }
            });
        }

        const pathParts = path.split('.');
        for (let i = pathParts.length - 1; i >= 0; i--) {
            const parentPath = pathParts.slice(0, i).join('.');
            if (parentPath) {
                const parentListeners = this._listeners.get(parentPath + '.*');
                if (parentListeners) {
                    parentListeners.forEach(listener => {
                        try {
                            listener(path, newValue, oldValue);
                        } catch (e) {
                            console.error('[ReactiveState] Listener error:', e);
                        }
                    });
                }
            }
        }

        const globalListeners = this._listeners.get('*');
        if (globalListeners) {
            globalListeners.forEach(listener => {
                try {
                    listener(path, newValue, oldValue);
                } catch (e) {
                    console.error('[ReactiveState] Listener error:', e);
                }
            });
        }
    }

    /**
     * 监听状态变化
     */
    watch(path: string, listener: StateListener): () => void {
        if (!this._listeners.has(path)) {
            this._listeners.set(path, new Set());
        }
        this._listeners.get(path)!.add(listener);

        return () => {
            const listeners = this._listeners.get(path);
            if (listeners) {
                listeners.delete(listener);
                if (listeners.size === 0) {
                    this._listeners.delete(path);
                }
            }
        };
    }

    /**
     * 批量更新状态
     */
    batch(updater: (state: AppState) => void): void {
        const tempListeners = this._listeners;
        this._listeners = new Map();

        try {
            if (this._state) {
                updater(this._state);
            }
        } finally {
            this._listeners = tempListeners;
            this._notify('*', this._state, null);
        }
    }

    /**
     * 获取状态快照
     */
    getSnapshot(): Record<string, unknown> {
        return JSON.parse(JSON.stringify(this._state, (key, value) => {
            if (value instanceof Set) {
                return Array.from(value);
            }
            return value;
        }));
    }
}

const stateManager = new ReactiveStateManager();

export const state: AppState = stateManager.init();

export const watchState = (path: string, listener: StateListener): (() => void) =>
    stateManager.watch(path, listener);

export const batchUpdate = (updater: (state: AppState) => void): void =>
    stateManager.batch(updater);

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
