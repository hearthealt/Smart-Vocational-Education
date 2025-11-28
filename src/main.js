/**
 * 智慧职教全能助手 - 主入口文件
 */

// ==================== 导入所有模块 ====================
import { Utils } from './utils/index.js';
import { Logger } from './utils/logger.js';
import { AI_PRESETS } from './utils/config.js';
import { loadLearningProgress } from './utils/state.js';
import { CONFIG, saveConfig } from './ui/config-instance.js';
import { createLearningTab } from './ui/learning-tab.js';
import { createExamTab } from './ui/exam-tab.js';
import { createLogTab } from './ui/log-tab.js';
import { addStyles } from './styles/index.js';

// 导入学习模块
import {
    scanLearningNodes,
    applyPlaybackRate,
    applyMuteToCurrentMedia,
    resetLearning,
    startLearning
} from './modules/learning-core.js';

// 导入答题模块
import {
    getAIConfig,
    startExam,
    stopExam,
    updateExamMessage
} from './modules/exam-core.js';

// ==================== 页面类型检测 ====================
function getPageType() {
    const url = window.location.href;
    if (url.includes('/excellent-study/')) {
        return 'learning';
    } else if (url.includes('/preview-exam/')) {
        return 'exam';
    }
    return 'all';
}

// ==================== 创建面板 ====================
function createPanel() {
    const panel = document.createElement('div');
    panel.id = 'icve-tabbed-panel';

    const pageType = getPageType();
    const showLearning = pageType === 'learning' || pageType === 'all';
    const showExam = pageType === 'exam' || pageType === 'all';

    // 根据页面类型确定默认标签页
    const defaultTab = pageType === 'exam' ? 'exam' : 'learning';

    panel.innerHTML = `
        <div class="panel-container">
            <!-- 头部：标题 + 控制按钮 -->
            <div class="panel-header" id="panel-header">
                <span class="panel-title">🎓 智慧职教全能助手</span>
                <div class="header-controls">
                    <button class="theme-toggle" id="theme-toggle" title="切换主题">🌙</button>
                    <button class="panel-toggle" id="panel-toggle" title="折叠/展开">−</button>
                </div>
            </div>

            <!-- 标签页导航 -->
            <div class="tab-nav">
                ${showLearning ? `<button class="tab-btn${defaultTab === 'learning' ? ' active' : ''}" data-tab="learning">📚 学习</button>` : ''}
                ${showExam ? `<button class="tab-btn${defaultTab === 'exam' ? ' active' : ''}" data-tab="exam">🤖 答题</button>` : ''}
                <button class="tab-btn" data-tab="log">📋 日志</button>
            </div>

            <!-- 标签页内容 -->
            <div class="tab-content-wrapper" id="tab-content-wrapper">
                ${showLearning ? `<!-- 学习标签页 -->
                <div class="tab-pane${defaultTab === 'learning' ? ' active' : ''}" id="tab-learning">
                    ${createLearningTab()}
                </div>` : ''}

                ${showExam ? `<!-- 答题标签页 -->
                <div class="tab-pane${defaultTab === 'exam' ? ' active' : ''}" id="tab-exam">
                    ${createExamTab()}
                </div>` : ''}

                <!-- 日志标签页 -->
                <div class="tab-pane" id="tab-log">
                    ${createLogTab()}
                </div>
            </div>
        </div>
    `;

    // 添加样式
    addStyles();

    document.body.appendChild(panel);

    // 绑定事件
    bindEvents();

    // 应用主题
    applyTheme(CONFIG.theme);

    // 恢复折叠状态
    restorePanelState();

    // 设置默认标签页
    switchTab(defaultTab);

    // 加载学习进度
    loadLearningProgress();
}

// ==================== 事件绑定 ====================
function bindEvents() {
    const panel = document.getElementById('icve-tabbed-panel');
    if (!panel) return;

    // 拖动面板
    makeDraggable();

    // 使用事件委托处理面板内的所有点击事件（使用防抖优化）
    panel.addEventListener('click', Utils.debounce(handlePanelClick, 100));

    // 使用事件委托处理所有change事件（使用节流优化）
    panel.addEventListener('change', Utils.throttle(handlePanelChange, 300));

    Logger.info('事件绑定完成');
}

// 统一处理点击事件
function handlePanelClick(e) {
    const target = e.target;
    const id = target.id || target.closest('[id]')?.id;

    // 使用对象映射提升性能
    const actionMap = {
        'theme-toggle': toggleTheme,
        'panel-toggle': togglePanel,
        'learning-start': startLearning,
        'learning-scan': scanLearningNodes,
        'learning-reset': resetLearning,
        'exam-start': startExam,
        'exam-stop': stopExam,
        'clear-page-log': () => Logger.clearPageLog()
    };

    // 执行对应操作
    if (actionMap[id]) {
        actionMap[id]();
        return;
    }

    // 处理标签页切换
    const tabBtn = target.closest('.tab-btn');
    if (tabBtn?.dataset.tab) {
        switchTab(tabBtn.dataset.tab);
    }
}

// 统一处理change事件
function handlePanelChange(e) {
    const target = e.target;
    const id = target.id;
    const value = target.type === 'checkbox' ? target.checked : target.value;

    switch(id) {
        // 学习配置
        case 'learning-playback-rate':
            CONFIG.learning.playbackRate = parseFloat(value);
            applyPlaybackRate();
            saveConfig();
            Logger.info(`播放倍速: ${CONFIG.learning.playbackRate}x`);
            break;

        case 'learning-wait-time':
            CONFIG.learning.waitTimeAfterComplete = parseInt(value);
            saveConfig();
            Logger.info(`完成等待时间: ${value}秒`);
            break;

        case 'learning-doc-interval':
            CONFIG.learning.documentPageInterval = parseInt(value);
            saveConfig();
            Logger.info(`文档翻页间隔: ${value}秒`);
            break;

        case 'learning-expand-delay':
            CONFIG.learning.expandDelay = parseFloat(value);
            saveConfig();
            Logger.info(`展开延迟: ${value}秒`);
            break;

        case 'learning-mute-media':
            CONFIG.learning.muteMedia = value;
            applyMuteToCurrentMedia();
            saveConfig();
            // 更新静音按钮图标
            const toggleIcon = document.querySelector('.btn-toggle-label .toggle-icon');
            if (toggleIcon) {
                toggleIcon.textContent = value ? '🔇' : '🔊';
            }
            Logger.info(`静音模式: ${value ? '开启' : '关闭'}`);
            break;

        // 答题配置
        case 'exam-ai-model':
            CONFIG.exam.currentAI = value;
            const preset = AI_PRESETS[CONFIG.exam.currentAI];
            const aiConfig = getAIConfig();

            // 更新输入框
            const apiKeyInput = document.getElementById('exam-api-key');
            const apiUrlInput = document.getElementById('exam-api-url');
            const modelInput = document.getElementById('exam-api-model-name');

            if (apiKeyInput) {
                apiKeyInput.value = aiConfig.apiKey;
                apiKeyInput.placeholder = preset.keyPlaceholder;
            }
            if (apiUrlInput) apiUrlInput.value = aiConfig.baseURL;
            if (modelInput) modelInput.value = aiConfig.model;

            updateExamMessage(`已切换到 ${preset.name}`, '#10b981');
            setTimeout(() => {
                updateExamMessage(`就绪（使用 ${preset.name}）`, '#64748b');
            }, 2000);
            saveConfig();
            Logger.info(`AI模型: ${preset.name}`);
            break;

        case 'exam-api-key':
            GM_setValue(`ai_key_${CONFIG.exam.currentAI}`, value.trim());
            updateExamMessage('API Key已保存', '#10b981');
            setTimeout(() => {
                updateExamMessage(`就绪（使用 ${AI_PRESETS[CONFIG.exam.currentAI].name}）`, '#64748b');
            }, 2000);
            Logger.info('API Key已更新');
            break;

        case 'exam-api-url':
            GM_setValue(`ai_baseurl_${CONFIG.exam.currentAI}`, value.trim());
            updateExamMessage('API地址已保存', '#10b981');
            setTimeout(() => {
                updateExamMessage(`就绪（使用 ${AI_PRESETS[CONFIG.exam.currentAI].name}）`, '#64748b');
            }, 2000);
            Logger.info(`API地址已更新`);
            break;

        case 'exam-api-model-name':
            GM_setValue(`ai_model_${CONFIG.exam.currentAI}`, value.trim());
            updateExamMessage('模型名称已保存', '#10b981');
            setTimeout(() => {
                updateExamMessage(`就绪（使用 ${AI_PRESETS[CONFIG.exam.currentAI].name}）`, '#64748b');
            }, 2000);
            Logger.info(`模型名称: ${value.trim()}`);
            break;

        case 'exam-delay':
            CONFIG.exam.delay = parseInt(value) * 1000;
            saveConfig();
            Logger.info(`答题间隔: ${value}秒`);
            break;

        case 'exam-auto-submit':
            CONFIG.exam.autoSubmit = value;
            saveConfig();
            Logger.info(`自动交卷: ${value ? '开启' : '关闭'}`);
            break;
    }
}

// ==================== 工具函数 ====================

// 切换标签页
function switchTab(tabName) {
    // 更新导航按钮
    document.querySelectorAll('.tab-btn').forEach(btn => {
        btn.classList.remove('active');
    });
    document.querySelector(`[data-tab="${tabName}"]`)?.classList.add('active');

    // 更新内容区域
    document.querySelectorAll('.tab-pane').forEach(pane => {
        pane.classList.remove('active');
    });
    document.getElementById(`tab-${tabName}`)?.classList.add('active');

    // 保存当前标签页
    CONFIG.currentTab = tabName;
    saveConfig();
}

// 切换主题
function toggleTheme() {
    CONFIG.theme = CONFIG.theme === 'light' ? 'dark' : 'light';
    applyTheme(CONFIG.theme);
    saveConfig();
}

// 应用主题
function applyTheme(theme) {
    const panel = document.getElementById('icve-tabbed-panel');
    const themeBtn = document.getElementById('theme-toggle');

    if (panel) {
        if (theme === 'dark') {
            panel.classList.add('dark-theme');
        } else {
            panel.classList.remove('dark-theme');
        }
    }

    if (themeBtn) {
        themeBtn.textContent = theme === 'dark' ? '☀️' : '🌙';
        themeBtn.title = theme === 'dark' ? '切换到浅色模式' : '切换到深色模式';
    }
}

// 折叠/展开面板
function togglePanel() {
    const wrapper = document.getElementById('tab-content-wrapper');
    const tabNav = document.querySelector('.tab-nav');
    const toggleBtn = document.getElementById('panel-toggle');

    if (wrapper.classList.contains('collapsed')) {
        wrapper.classList.remove('collapsed');
        if (tabNav) tabNav.classList.remove('collapsed');
        toggleBtn.textContent = '−';
        localStorage.setItem('icve_panel_collapsed', 'false');
    } else {
        wrapper.classList.add('collapsed');
        if (tabNav) tabNav.classList.add('collapsed');
        toggleBtn.textContent = '+';
        localStorage.setItem('icve_panel_collapsed', 'true');
    }
}

// 恢复折叠状态
function restorePanelState() {
    const isCollapsed = localStorage.getItem('icve_panel_collapsed') === 'true';
    if (isCollapsed) {
        const wrapper = document.getElementById('tab-content-wrapper');
        const tabNav = document.querySelector('.tab-nav');
        const toggleBtn = document.getElementById('panel-toggle');

        if (wrapper) wrapper.classList.add('collapsed');
        if (tabNav) tabNav.classList.add('collapsed');
        if (toggleBtn) toggleBtn.textContent = '+';
    }
}

// 使面板可拖动
function makeDraggable() {
    const panel = document.getElementById('icve-tabbed-panel');
    const header = document.getElementById('panel-header');
    let isDragging = false;
    let currentX, currentY, initialX, initialY;

    header.addEventListener('mousedown', (e) => {
        initialX = e.clientX - panel.offsetLeft;
        initialY = e.clientY - panel.offsetTop;
        isDragging = true;
    });

    document.addEventListener('mousemove', (e) => {
        if (isDragging) {
            e.preventDefault();
            currentX = e.clientX - initialX;
            currentY = e.clientY - initialY;
            panel.style.left = currentX + 'px';
            panel.style.top = currentY + 'px';
            panel.style.right = 'auto';
        }
    });

    document.addEventListener('mouseup', () => {
        isDragging = false;
    });
}

// ==================== 日志计数更新 ====================
// 定义全局函数供 Logger 调用
window.updateLogCount = function() {
    const logCountElement = document.getElementById('log-count');
    if (logCountElement) {
        logCountElement.textContent = `${Logger._logs.length} 条记录`;
    }
};

// ==================== 初始化 ====================
function init() {
    // 创建面板
    createPanel();

    Logger.info('智慧职教全能助手已加载');
}

// 页面加载完成后初始化
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        setTimeout(init, 1000);
    });
} else {
    setTimeout(init, 1000);
}
