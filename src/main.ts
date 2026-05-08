/**
 * 智慧职教全能助手 - 主入口文件
 */

// ==================== 导入所有模块 ====================
import { Utils } from './utils/index';
import { Logger } from './utils/logger';
import { AI_PRESETS, normalizeAIType } from './utils/config';
import { loadLearningProgress } from './utils/state';
import { CONFIG, saveConfig } from './ui/config-instance';
import { createLearningTab } from './ui/learning-tab';
import { createExamTab } from './ui/exam-tab';
import { createLogTab, getLogToolbarStyles, setCurrentFilter, setCurrentSearch } from './ui/log-tab';
import { addStyles } from './styles/index.js';
import { showGuide, getGuideStyles, resetGuide } from './ui/guide';
import { downloadConfig, resetToDefault, createFileInput, getConfigManagementStyles } from './ui/config-management';
import { showConfirmDialog, showToast, getUIUtilsStyles } from './ui/ui-utils';
import { DOMCache } from './utils/dom-cache';
import type { PanelPosition, LogType } from './types/index';

// 导入学习模块
import {
    scanLearningNodes,
    applyPlaybackRate,
    applyMuteToCurrentMedia,
    resetLearning,
    startLearning
} from './modules/learning-core';

// 导入答题模块
import {
    getAIConfig,
    startExam,
    stopExam,
    updateExamMessage
} from './modules/exam-core';


// ==================== 页面类型检测 ====================
type PageType = 'learning' | 'exam' | 'all';

function getPageType(): PageType {
    const url = window.location.href;
    if (url.includes('/excellent-study/')) {
        return 'learning';
    } else if (url.includes('/preview-exam/')) {
        return 'exam';
    }
    return 'all';
}

// ==================== 创建面板 ====================
function createPanel(): void {
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
    addExtraStyles();

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

    // 显示新手引导（首次使用时）
    setTimeout(() => {
        showGuide();
    }, 500);
}

// 添加额外样式
function addExtraStyles(): void {
    const style = document.createElement('style');
    style.textContent = getGuideStyles() + getLogToolbarStyles() + getConfigManagementStyles() + getUIUtilsStyles();
    document.head.appendChild(style);
}

// ==================== 事件绑定 ====================
function bindEvents(): void {
    const panel = document.getElementById('icve-tabbed-panel');
    if (!panel) return;

    // 拖动面板
    makeDraggable();

    // 点击事件不使用防抖，直接处理以保证响应速度
    // 改用 requestIdleCallback 在空闲时执行非关键操作
    panel.addEventListener('click', handlePanelClick);

    // change 事件使用适当的节流，150ms 足够
    panel.addEventListener('change', Utils.throttle(handlePanelChange, 150));

    // 绑定日志筛选和搜索
    bindLogEvents();

    // 绑定 details 元素的折叠状态持久化
    bindDetailsToggle();

    Logger.info('事件绑定完成');
}

// 绑定日志相关事件
function bindLogEvents(): void {
    // 日志筛选按钮
    document.querySelectorAll('.log-filter-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            const filter = (btn as HTMLElement).dataset.filter as LogType | 'all';

            // 更新按钮状态
            document.querySelectorAll('.log-filter-btn').forEach(b => b.classList.remove('active'));
            btn.classList.add('active');

            // 执行筛选
            setCurrentFilter(filter);
            Logger.filterLogs(filter);
        });
    });

    // 日志搜索
    const searchInput = document.getElementById('log-search') as HTMLInputElement;
    const searchClear = document.getElementById('log-search-clear');

    if (searchInput) {
        searchInput.addEventListener('input', Utils.debounce(() => {
            setCurrentSearch(searchInput.value);
            Logger.searchLogs(searchInput.value);
        }, 200));
    }

    if (searchClear && searchInput) {
        searchClear.addEventListener('click', () => {
            searchInput.value = '';
            setCurrentSearch('');
            Logger.searchLogs('');
        });
    }
}

// 统一处理点击事件
async function handlePanelClick(e: Event): Promise<void> {
    const target = e.target as HTMLElement;
    const id = target.id || target.closest('[id]')?.id;

    // 使用对象映射提升性能
    const actionMap: Record<string, () => void | Promise<void>> = {
        'theme-toggle': toggleTheme,
        'panel-toggle': togglePanel,
        'learning-start': startLearning,
        'learning-scan': scanLearningNodes,
        'learning-reset': handleResetLearning,
        'exam-start': startExam,
        'exam-stop': stopExam,
        'clear-page-log': handleClearLog,
        'export-log': () => Logger.downloadLogs(),
        'export-config': downloadConfig,
        'import-config': handleImportConfig,
        'reset-config': handleResetConfig,
        'show-guide': () => { resetGuide(); showGuide(); }
    };

    // 执行对应操作
    if (id && actionMap[id]) {
        await actionMap[id]();
        return;
    }

    // 处理标签页切换
    const tabBtn = target.closest('.tab-btn') as HTMLElement | null;
    if (tabBtn?.dataset.tab) {
        switchTab(tabBtn.dataset.tab);
    }

    // 处理日志筛选按钮
    const filterBtn = target.closest('.log-filter-btn') as HTMLElement | null;
    if (filterBtn?.dataset.filter) {
        const filter = filterBtn.dataset.filter as LogType | 'all';
        document.querySelectorAll('.log-filter-btn').forEach(b => b.classList.remove('active'));
        filterBtn.classList.add('active');
        setCurrentFilter(filter);
        Logger.filterLogs(filter);
    }
}

// 处理重置学习进度（带确认）
async function handleResetLearning(): Promise<void> {
    const confirmed = await showConfirmDialog({
        title: '重置学习进度',
        message: '确定要清空所有已处理节点的记录吗？此操作不可恢复。',
        confirmText: '确认重置',
        cancelText: '取消',
        danger: true
    });

    if (confirmed) {
        resetLearning();
        showToast('学习进度已重置', 'success');
    }
}

// 处理清空日志（带确认）
async function handleClearLog(): Promise<void> {
    if (Logger._logs.length === 0) {
        showToast('日志已经是空的', 'info');
        return;
    }

    const confirmed = await showConfirmDialog({
        title: '清空日志',
        message: `确定要清空所有 ${Logger._logs.length} 条日志记录吗？`,
        confirmText: '清空',
        cancelText: '取消',
        danger: true
    });

    if (confirmed) {
        Logger.clearPageLog();
        showToast('日志已清空', 'success');
    }
}

// 处理导入配置
function handleImportConfig(): void {
    const fileInput = createFileInput((result) => {
        if (result.success) {
            showToast(result.message, 'success');
            setTimeout(() => {
                window.location.reload();
            }, 1500);
        } else {
            showToast(result.message, 'error');
        }
    });
    fileInput.click();
}

// 处理重置配置（带确认）
async function handleResetConfig(): Promise<void> {
    const confirmed = await showConfirmDialog({
        title: '恢复默认配置',
        message: '确定要将所有配置重置为默认值吗？包括AI密钥等配置都将被清除。',
        confirmText: '确认重置',
        cancelText: '取消',
        danger: true
    });

    if (confirmed) {
        resetToDefault();
        showToast('配置已重置，页面将刷新', 'success');
        setTimeout(() => {
            window.location.reload();
        }, 1500);
    }
}

// 统一处理change事件
function handlePanelChange(e: Event): void {
    const target = e.target as HTMLInputElement | HTMLSelectElement;
    const id = target.id;
    const value = target.type === 'checkbox' ? (target as HTMLInputElement).checked : target.value;

    switch(id) {
        // 学习配置
        case 'learning-playback-rate':
            CONFIG.learning.playbackRate = parseFloat(value as string);
            applyPlaybackRate();
            saveConfig();
            Logger.info(`播放倍速: ${CONFIG.learning.playbackRate}x`);
            break;

        case 'learning-wait-time':
            CONFIG.learning.waitTimeAfterComplete = parseInt(value as string);
            saveConfig();
            Logger.info(`完成等待时间: ${value}秒`);
            break;

        case 'learning-doc-interval':
            CONFIG.learning.documentPageInterval = parseInt(value as string);
            saveConfig();
            Logger.info(`文档翻页间隔: ${value}秒`);
            break;

        case 'learning-expand-delay':
            CONFIG.learning.expandDelay = parseFloat(value as string);
            saveConfig();
            Logger.info(`展开延迟: ${value}秒`);
            break;

        case 'learning-mute-media':
            CONFIG.learning.muteMedia = value as boolean;
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
            CONFIG.exam.currentAI = normalizeAIType(value as string);
            const preset = AI_PRESETS[CONFIG.exam.currentAI];
            const aiConfig = getAIConfig();

            // 更新输入框
            const apiKeyInput = document.getElementById('exam-api-key') as HTMLInputElement | null;
            const apiUrlInput = document.getElementById('exam-api-url') as HTMLInputElement | null;
            const modelInput = document.getElementById('exam-api-model-name') as HTMLInputElement | null;

            if (apiKeyInput) {
                apiKeyInput.value = aiConfig.apiKey;
                apiKeyInput.placeholder = preset.keyPlaceholder;
            }
            if (apiUrlInput) apiUrlInput.value = aiConfig.baseURL;
            if (modelInput) modelInput.value = aiConfig.model;

            const examMessage = document.getElementById('exam-message');
            if (examMessage) examMessage.textContent = '💡 配置完成后点击"开始"';

            updateExamMessage(`已切换到 ${preset.name}`, '#10b981');
            setTimeout(() => {
                updateExamMessage(`就绪（使用 ${preset.name}）`, '#64748b');
            }, 2000);
            saveConfig();
            Logger.info(`AI模型: ${preset.name}`);
            break;

        case 'exam-api-key':
            GM_setValue(`ai_key_${CONFIG.exam.currentAI}`, (value as string).trim());
            updateExamMessage('API Key已保存', '#10b981');
            setTimeout(() => {
                updateExamMessage(`就绪（使用 ${AI_PRESETS[CONFIG.exam.currentAI].name}）`, '#64748b');
            }, 2000);
            Logger.info('API Key已更新');
            break;

        case 'exam-api-url':
            GM_setValue(`ai_baseurl_${CONFIG.exam.currentAI}`, (value as string).trim());
            updateExamMessage('API地址已保存', '#10b981');
            setTimeout(() => {
                updateExamMessage(`就绪（使用 ${AI_PRESETS[CONFIG.exam.currentAI].name}）`, '#64748b');
            }, 2000);
            Logger.info(`API地址已更新`);
            break;

        case 'exam-api-model-name':
            GM_setValue(`ai_model_${CONFIG.exam.currentAI}`, (value as string).trim());
            updateExamMessage('模型名称已保存', '#10b981');
            setTimeout(() => {
                updateExamMessage(`就绪（使用 ${AI_PRESETS[CONFIG.exam.currentAI].name}）`, '#64748b');
            }, 2000);
            Logger.info(`模型名称: ${(value as string).trim()}`);
            break;

        case 'exam-delay':
            CONFIG.exam.delay = parseInt(value as string) * 1000;
            saveConfig();
            Logger.info(`答题间隔: ${value}秒`);
            break;

        case 'exam-auto-submit':
            CONFIG.exam.autoSubmit = value as boolean;
            saveConfig();
            Logger.info(`自动交卷: ${value ? '开启' : '关闭'}`);
            break;
    }
}

// ==================== 工具函数 ====================

// 切换标签页
function switchTab(tabName: string): void {
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
function toggleTheme(): void {
    CONFIG.theme = CONFIG.theme === 'light' ? 'dark' : 'light';
    applyTheme(CONFIG.theme);
    saveConfig();
}

// 应用主题
function applyTheme(theme: 'light' | 'dark'): void {
    const panel = DOMCache.getById('icve-tabbed-panel');
    const themeBtn = DOMCache.getById('theme-toggle');

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
function togglePanel(): void {
    const wrapper = DOMCache.getById('tab-content-wrapper');
    const tabNav = DOMCache.get('.tab-nav');
    const toggleBtn = DOMCache.getById('panel-toggle');

    if (!wrapper || !toggleBtn) return;

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
function restorePanelState(): void {
    const isCollapsed = localStorage.getItem('icve_panel_collapsed') === 'true';
    if (isCollapsed) {
        const wrapper = DOMCache.getById('tab-content-wrapper');
        const tabNav = DOMCache.get('.tab-nav');
        const toggleBtn = DOMCache.getById('panel-toggle');

        if (wrapper) wrapper.classList.add('collapsed');
        if (tabNav) tabNav.classList.add('collapsed');
        if (toggleBtn) toggleBtn.textContent = '+';
    }
}

// 使面板可拖动（带边界检测和位置持久化）
function makeDraggable(): void {
    const panel = DOMCache.getById('icve-tabbed-panel');
    const header = DOMCache.getById('panel-header');
    if (!panel || !header) return;

    let isDragging = false;
    let initialX: number, initialY: number;
    let hasMoved = false;

    // 恢复保存的位置
    restorePanelPosition();

    header.addEventListener('mousedown', (e: MouseEvent) => {
        // 忽略按钮点击
        if ((e.target as HTMLElement).closest('button')) return;

        const rect = panel.getBoundingClientRect();
        initialX = e.clientX - rect.left;
        initialY = e.clientY - rect.top;
        isDragging = true;
        hasMoved = false;
        panel.style.transition = 'none'; // 拖动时禁用过渡动画
    });

    document.addEventListener('mousemove', (e: MouseEvent) => {
        if (!isDragging) return;

        e.preventDefault();
        hasMoved = true;

        const panelRect = panel.getBoundingClientRect();
        const viewportWidth = window.innerWidth;
        const viewportHeight = window.innerHeight;

        // 计算新位置
        let newX = e.clientX - initialX;
        let newY = e.clientY - initialY;

        // 边界检测 - 确保面板至少有 50px 可见
        const minVisible = 50;
        const maxX = viewportWidth - minVisible;
        const maxY = viewportHeight - minVisible;
        const minX = minVisible - panelRect.width;
        const minY = 0; // 顶部不能超出

        newX = Math.max(minX, Math.min(newX, maxX));
        newY = Math.max(minY, Math.min(newY, maxY));

        panel.style.left = newX + 'px';
        panel.style.top = newY + 'px';
        panel.style.right = 'auto';
    });

    document.addEventListener('mouseup', () => {
        if (isDragging && hasMoved) {
            // 保存位置
            savePanelPosition();
            panel.style.transition = ''; // 恢复过渡动画
        }
        isDragging = false;
    });

    // 窗口大小改变时，确保面板在可视区域内
    window.addEventListener('resize', Utils.debounce(() => {
        ensurePanelInViewport();
    }, 200));
}

// 保存面板位置
function savePanelPosition(): void {
    const panel = DOMCache.getById('icve-tabbed-panel');
    if (!panel) return;

    const rect = panel.getBoundingClientRect();
    const position: PanelPosition = {
        left: rect.left,
        top: rect.top,
        timestamp: Date.now()
    };
    localStorage.setItem('icve_panel_position', JSON.stringify(position));
}

// 恢复面板位置
function restorePanelPosition(): void {
    const panel = DOMCache.getById('icve-tabbed-panel');
    if (!panel) return;

    try {
        const saved = localStorage.getItem('icve_panel_position');
        if (!saved) return;

        const position: PanelPosition = JSON.parse(saved);

        // 检查保存的位置是否有效（7天内）
        if (Date.now() - position.timestamp > 7 * 24 * 60 * 60 * 1000) {
            localStorage.removeItem('icve_panel_position');
            return;
        }

        // 应用保存的位置
        panel.style.left = position.left + 'px';
        panel.style.top = position.top + 'px';
        panel.style.right = 'auto';

        // 确保在可视区域内
        requestAnimationFrame(() => {
            ensurePanelInViewport();
        });
    } catch {
        // 忽略解析错误
    }
}

// 确保面板在可视区域内
function ensurePanelInViewport(): void {
    const panel = DOMCache.getById('icve-tabbed-panel');
    if (!panel) return;

    const rect = panel.getBoundingClientRect();
    const viewportWidth = window.innerWidth;
    const viewportHeight = window.innerHeight;
    const minVisible = 50;

    let needsUpdate = false;
    let newLeft = rect.left;
    let newTop = rect.top;

    // 检查右边界
    if (rect.left > viewportWidth - minVisible) {
        newLeft = viewportWidth - minVisible;
        needsUpdate = true;
    }
    // 检查左边界
    if (rect.right < minVisible) {
        newLeft = minVisible - rect.width;
        needsUpdate = true;
    }
    // 检查下边界
    if (rect.top > viewportHeight - minVisible) {
        newTop = viewportHeight - minVisible;
        needsUpdate = true;
    }
    // 检查上边界
    if (rect.top < 0) {
        newTop = 0;
        needsUpdate = true;
    }

    if (needsUpdate) {
        panel.style.left = newLeft + 'px';
        panel.style.top = newTop + 'px';
        panel.style.right = 'auto';
        savePanelPosition();
    }
}

// ==================== Details 折叠状态持久化 ====================
const DETAILS_STORAGE_KEY = 'icve_details_state';

// 绑定 details 元素的 toggle 事件
function bindDetailsToggle(): void {
    const panel = DOMCache.getById('icve-tabbed-panel');
    if (!panel) return;

    // 获取所有 details 元素
    const detailsElements = panel.querySelectorAll('details[id]');

    detailsElements.forEach(details => {
        // 恢复保存的状态
        restoreDetailsState(details as HTMLDetailsElement);

        // 监听 toggle 事件
        details.addEventListener('toggle', () => {
            saveDetailsState(details as HTMLDetailsElement);
        });
    });
}

// 保存单个 details 元素的状态
function saveDetailsState(details: HTMLDetailsElement): void {
    if (!details.id) return;

    try {
        const saved = localStorage.getItem(DETAILS_STORAGE_KEY);
        const states: Record<string, boolean> = saved ? JSON.parse(saved) : {};

        states[details.id] = details.open;
        localStorage.setItem(DETAILS_STORAGE_KEY, JSON.stringify(states));
    } catch {
        // 忽略存储错误
    }
}

// 恢复单个 details 元素的状态
function restoreDetailsState(details: HTMLDetailsElement): void {
    if (!details.id) return;

    try {
        const saved = localStorage.getItem(DETAILS_STORAGE_KEY);
        if (!saved) return;

        const states: Record<string, boolean> = JSON.parse(saved);
        if (typeof states[details.id] === 'boolean') {
            details.open = states[details.id];
        }
    } catch {
        // 忽略解析错误
    }
}

// ==================== 日志计数更新 ====================
// 定义全局函数供 Logger 调用
window.updateLogCount = function(): void {
    const logCountElement = document.getElementById('log-count');
    if (logCountElement) {
        logCountElement.textContent = `${Logger._logs.length} 条记录`;
    }
};

// ==================== 初始化 ====================
function init(): void {
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
