/**
 * 创建日志标签页
 */
export function createLogTab() {
    return `
        <div class="log-tab-container">
            <div class="log-container" id="page-log-container">
                <div class="log-placeholder">暂无日志记录</div>
            </div>
            <div class="log-footer">
                <span class="log-count-text" id="log-count">0 条记录</span>
                <button class="btn btn-secondary btn-clear-log" id="clear-page-log">🗑 清空日志</button>
            </div>
        </div>
    `;
}
