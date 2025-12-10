/**
 * 日志标签页
 */

import type { LogType } from '../types/index';

// 当前筛选状态
let currentFilter: LogType | 'all' = 'all';
let currentSearch = '';

/**
 * 创建日志标签页
 */
export function createLogTab(): string {
    return `
        <div class="log-tab-container">
            <!-- 日志工具栏 -->
            <div class="log-toolbar">
                <div class="log-filter-group">
                    <button class="log-filter-btn active" data-filter="all" title="全部日志">全部</button>
                    <button class="log-filter-btn" data-filter="info" title="信息日志">ℹ️</button>
                    <button class="log-filter-btn" data-filter="success" title="成功日志">✅</button>
                    <button class="log-filter-btn" data-filter="warn" title="警告日志">⚠️</button>
                    <button class="log-filter-btn" data-filter="error" title="错误日志">❌</button>
                </div>
                <div class="log-search-wrapper">
                    <input type="text" class="log-search-input" id="log-search" placeholder="搜索日志..." />
                    <button class="log-search-clear" id="log-search-clear" title="清除搜索">✕</button>
                </div>
            </div>

            <!-- 日志内容区域 -->
            <div class="log-container" id="page-log-container">
                <div class="log-placeholder">暂无日志记录</div>
            </div>

            <!-- 日志底部工具栏 -->
            <div class="log-footer">
                <span class="log-count-text" id="log-count">0 条记录</span>
                <div class="log-actions">
                    <button class="btn btn-secondary btn-sm" id="export-log" title="导出日志">📥 导出</button>
                    <button class="btn btn-secondary btn-sm" id="clear-page-log" title="清空日志">🗑 清空</button>
                </div>
            </div>
        </div>
    `;
}

/**
 * 获取当前筛选状态
 */
export function getCurrentFilter(): LogType | 'all' {
    return currentFilter;
}

/**
 * 设置筛选状态
 */
export function setCurrentFilter(filter: LogType | 'all'): void {
    currentFilter = filter;
}

/**
 * 获取当前搜索关键词
 */
export function getCurrentSearch(): string {
    return currentSearch;
}

/**
 * 设置搜索关键词
 */
export function setCurrentSearch(search: string): void {
    currentSearch = search;
}

/**
 * 获取日志工具栏样式
 */
export function getLogToolbarStyles(): string {
    return `
        /* 日志工具栏 */
        .log-toolbar {
            display: flex;
            gap: 8px;
            padding: 8px;
            background: var(--bg-secondary);
            border-bottom: 1px solid var(--border-color);
            flex-wrap: wrap;
        }

        .log-filter-group {
            display: flex;
            gap: 4px;
        }

        .log-filter-btn {
            padding: 4px 8px;
            font-size: 12px;
            border: 1px solid var(--border-color);
            background: var(--bg-primary);
            color: var(--text-secondary);
            border-radius: 4px;
            cursor: pointer;
            transition: all 0.2s;
        }

        .log-filter-btn:hover {
            background: var(--bg-hover);
        }

        .log-filter-btn.active {
            background: var(--primary-color);
            color: white;
            border-color: var(--primary-color);
        }

        .log-search-wrapper {
            flex: 1;
            min-width: 120px;
            position: relative;
        }

        .log-search-input {
            width: 100%;
            padding: 4px 28px 4px 8px;
            font-size: 12px;
            border: 1px solid var(--border-color);
            border-radius: 4px;
            background: var(--bg-primary);
            color: var(--text-primary);
        }

        .log-search-input:focus {
            outline: none;
            border-color: var(--primary-color);
            box-shadow: 0 0 0 2px rgba(102, 126, 234, 0.2);
        }

        .log-search-clear {
            position: absolute;
            right: 4px;
            top: 50%;
            transform: translateY(-50%);
            background: none;
            border: none;
            color: var(--text-secondary);
            cursor: pointer;
            padding: 2px 4px;
            font-size: 12px;
            opacity: 0;
            transition: opacity 0.2s;
        }

        .log-search-input:not(:placeholder-shown) + .log-search-clear {
            opacity: 0.6;
        }

        .log-search-clear:hover {
            opacity: 1;
        }

        /* 日志底部工具栏 */
        .log-footer {
            display: flex;
            justify-content: space-between;
            align-items: center;
            padding: 8px;
            background: var(--bg-secondary);
            border-top: 1px solid var(--border-color);
        }

        .log-actions {
            display: flex;
            gap: 6px;
        }

        .log-actions .btn-sm {
            padding: 4px 12px;
            font-size: 12px;
            white-space: nowrap;
        }

        /* 日志条目过滤动画 */
        .log-entry.filtered {
            display: none;
        }

        .log-entry.highlight {
            background: rgba(251, 191, 36, 0.2) !important;
        }

        /* 无匹配结果提示 */
        .log-no-results {
            padding: 20px;
            text-align: center;
            color: var(--text-secondary);
            font-size: 13px;
        }
    `;
}
