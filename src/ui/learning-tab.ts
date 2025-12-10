/**
 * 学习标签页
 */

import { CONFIG } from './config-instance';
import { createConfigManagementSection } from './config-management';

/**
 * 创建学习标签页
 */
export function createLearningTab(): string {
    return `
        <div class="tab-inner">
            <!-- 状态区域 -->
            <div class="learning-status-section">
                <div class="status-row">
                    <span class="status-item">
                        <span class="status-dot" id="learning-status-dot"></span>
                        <span id="learning-status">停止中</span>
                    </span>
                    <span class="status-item">
                        <span>📊</span>
                        <span id="learning-progress">0/0</span>
                    </span>
                    <span class="status-item">
                        <span>✅</span>
                        <span><span id="learning-processed">0</span>个</span>
                    </span>
                </div>
                <div class="progress-bar-wrapper">
                    <div class="progress-bar" id="learning-progress-bar" data-progress="0%"></div>
                </div>
                <div class="current-node">
                    <span class="node-icon">📖</span>
                    <span class="node-text" id="learning-current" title="">等待开始...</span>
                </div>
                <div class="status-message" id="learning-progress-text" style="margin-top: 8px;">等待开始...</div>
            </div>

            <!-- 控制按钮 -->
            <div class="learning-controls">
                <button class="btn btn-primary btn-large" id="learning-start">▶️ 开始学习</button>
                <div class="btn-group">
                    <button class="btn btn-outline" id="learning-scan">🔍 扫描</button>
                    <button class="btn btn-outline" id="learning-reset">🔄 重置</button>
                    <label class="btn btn-outline btn-toggle-label">
                        <input type="checkbox" id="learning-mute-media" ${CONFIG.learning.muteMedia ? 'checked' : ''} hidden>
                        <span class="toggle-icon">${CONFIG.learning.muteMedia ? '🔇' : '🔊'}</span>
                        <span>静音</span>
                    </label>
                </div>
            </div>

            <!-- 学习配置 -->
            <div class="settings-section">
                <div class="section-header">
                    <h3>⚙️ 学习配置</h3>
                </div>
                <div class="settings-grid">
                    <div class="setting-item">
                        <label class="setting-label">播放倍速</label>
                        <select id="learning-playback-rate" class="select-control">
                            <option value="1.0" ${CONFIG.learning.playbackRate === 1.0 ? 'selected' : ''}>1.0x</option>
                            <option value="1.5" ${CONFIG.learning.playbackRate === 1.5 ? 'selected' : ''}>1.5x</option>
                            <option value="2.0" ${CONFIG.learning.playbackRate === 2.0 ? 'selected' : ''}>2.0x</option>
                            <option value="3.0" ${CONFIG.learning.playbackRate === 3.0 ? 'selected' : ''}>3.0x</option>
                            <option value="4.0" ${CONFIG.learning.playbackRate === 4.0 ? 'selected' : ''}>4.0x</option>
                            <option value="6.0" ${CONFIG.learning.playbackRate === 6.0 ? 'selected' : ''}>6.0x</option>
                            <option value="8.0" ${CONFIG.learning.playbackRate === 8.0 ? 'selected' : ''}>8.0x</option>
                            <option value="16.0" ${CONFIG.learning.playbackRate === 16.0 ? 'selected' : ''}>16.0x</option>
                        </select>
                    </div>
                    <div class="setting-item">
                        <label class="setting-label">完成等待</label>
                        <div class="input-with-unit">
                            <input type="number" id="learning-wait-time" class="input-control"
                                   value="${CONFIG.learning.waitTimeAfterComplete}" min="1" max="30">
                            <span class="unit">秒</span>
                        </div>
                    </div>
                    <div class="setting-item">
                        <label class="setting-label">翻页间隔</label>
                        <div class="input-with-unit">
                            <input type="number" id="learning-doc-interval" class="input-control"
                                   value="${CONFIG.learning.documentPageInterval}" min="1" max="60">
                            <span class="unit">秒</span>
                        </div>
                    </div>
                    <div class="setting-item">
                        <label class="setting-label">展开延迟</label>
                        <div class="input-with-unit">
                            <input type="number" id="learning-expand-delay" class="input-control"
                                   value="${CONFIG.learning.expandDelay}" min="1" max="10" step="0.5">
                            <span class="unit">秒</span>
                        </div>
                    </div>
                </div>
            </div>

            <!-- 配置管理 -->
            ${createConfigManagementSection()}
        </div>
    `;
}
