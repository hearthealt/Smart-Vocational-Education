/**
 * 智慧职教全能助手 - 主入口文件
 */

// ==================== 导入所有模块 ====================
import { Utils } from './utils/index';
import { Logger } from './utils/logger';
import { AI_PRESETS, normalizeAIType } from './utils/config';
import { state, loadLearningProgress } from './utils/state';
import { CONFIG, saveConfig } from './ui/config-instance';
import { addStyles } from './styles/index.js';
import { showGuide, getGuideStyles, resetGuide } from './ui/guide';
import { downloadConfig, resetToDefault, createFileInput } from './ui/config-management';
import { showConfirmDialog, showToast, getUIUtilsStyles } from './ui/ui-utils';
import { DOMCache } from './utils/dom-cache';
import type { PanelPosition } from './types/index';

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
    updateExamMessage,
    testAIConnection
} from './modules/exam-core';


// ==================== 页面类型检测 ====================
type PageType = 'learning' | 'exam' | 'all';
type TaskType = 'learning' | 'exam' | 'config';
type DragSource = 'header' | 'launcher';

let suppressLauncherOpen = false;

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
function getDefaultTask(pageType: PageType): TaskType {
    return pageType === 'exam' ? 'exam' : 'learning';
}

function createTaskSwitcher(pageType: PageType, activeTask: TaskType): string {
    const tasks: Array<{ key: TaskType; label: string }> = [];
    if (pageType === 'learning' || pageType === 'all') {
        tasks.push({ key: 'learning', label: '学习' });
    }
    if (pageType === 'exam' || pageType === 'all') {
        tasks.push({ key: 'exam', label: '答题' });
    }
    tasks.push({ key: 'config', label: '配置' });

    const buttons = tasks.map(task => `
            <button class="task-switch-btn${activeTask === task.key ? ' active' : ''}" data-task-select="${task.key}">${task.label}</button>
    `).join('');

    return `
        <div class="task-switcher" role="tablist" aria-label="任务模式" style="--task-count: ${tasks.length};">
${buttons}
        </div>
    `;
}

function createLauncher(defaultTask: TaskType): string {
    const taskText = defaultTask === 'exam' ? '答题就绪' : '学习就绪';
    return `
        <button class="icve-launcher" id="icve-launcher" type="button" title="拖动移动，点击打开智慧职教助手">
            <span class="launcher-grip" aria-hidden="true"></span>
            <span class="launcher-dot"></span>
            <span class="launcher-title">智慧职教助手</span>
            <span class="launcher-meta">${taskText}</span>
        </button>
    `;
}

function createLearningWorkbench(): string {
    return `
        <section class="workbench-task" data-task-panel="learning">
            <div class="task-card">
                <div class="task-card-header">
                    <div>
                        <div class="section-kicker">当前任务</div>
                        <h2>学习模式</h2>
                    </div>
                    <div class="task-status">
                        <span class="status-dot" id="learning-status-dot"></span>
                        <span id="learning-status">停止中</span>
                    </div>
                </div>
                <div class="task-metrics">
                    <div>
                        <span class="metric-label">进度</span>
                        <strong id="learning-progress">0/0</strong>
                    </div>
                    <div>
                        <span class="metric-label">已处理</span>
                        <strong><span id="learning-processed">0</span> 个</strong>
                    </div>
                </div>
                <div class="progress-bar-wrapper">
                    <div class="progress-bar" id="learning-progress-bar" data-progress="0%"></div>
                </div>
                <div class="current-line">
                    <span>当前</span>
                    <strong id="learning-current" title="">等待开始</strong>
                </div>
                <div class="inline-status" id="learning-progress-text">等待开始</div>
            </div>

            <div class="primary-action-block">
                <button class="btn btn-primary btn-large" id="learning-start">开始学习</button>
                <div class="action-pair">
                    <button class="btn btn-secondary" id="learning-scan">扫描课程</button>
                    <button class="btn btn-outline" id="learning-reset">重置进度</button>
                </div>
            </div>

            <div class="quick-settings">
                <div><span>倍速</span><strong>${CONFIG.learning.playbackRate}x</strong></div>
                <div><span>等待</span><strong>${CONFIG.learning.waitTimeAfterComplete} 秒</strong></div>
                <div><span>静音</span><strong>${CONFIG.learning.muteMedia ? '开' : '关'}</strong></div>
            </div>
        </section>
    `;
}

function createExamWorkbench(): string {
    const aiType = normalizeAIType(CONFIG.exam.currentAI);
    const aiConfig = getAIConfig();
    const preset = AI_PRESETS[aiType];

    return `
        <section class="workbench-task" data-task-panel="exam">
            <div class="task-card">
                <div class="task-card-header">
                    <div>
                        <div class="section-kicker">当前任务</div>
                        <h2>答题模式</h2>
                    </div>
                    <div class="task-status">
                        <span class="status-dot" id="exam-status-dot"></span>
                        <span id="exam-status">就绪</span>
                    </div>
                </div>
                <div class="task-metrics">
                    <div>
                        <span class="metric-label">进度</span>
                        <strong id="exam-progress">0/0</strong>
                    </div>
                    <div>
                        <span class="metric-label">AI</span>
                        <strong id="exam-ai-service-name">${preset.name}</strong>
                    </div>
                </div>
                <div class="progress-bar-wrapper">
                    <div class="progress-bar" id="exam-progress-bar" data-progress="0%"></div>
                </div>
                <div class="current-line">
                    <span>模型</span>
                    <strong id="exam-ai-service-model" title="${aiConfig.baseURL}">${aiConfig.model || '未配置模型'}</strong>
                </div>
                <div class="inline-status" id="exam-message">配置完成后点击开始</div>
            </div>

            <div class="primary-action-block">
                <button class="btn btn-primary btn-large" id="exam-start">开始答题</button>
                <div class="action-pair">
                    <button class="btn btn-secondary" id="exam-test-ai">测试 AI</button>
                    <button class="btn btn-danger" id="exam-stop" disabled>停止</button>
                </div>
            </div>

            <div class="quick-settings">
                <div><span>服务</span><strong>${preset.name}</strong></div>
                <div><span>延迟</span><strong>${CONFIG.exam.delay / 1000} 秒</strong></div>
                <div><span>交卷</span><strong>${CONFIG.exam.autoSubmit ? '自动' : '手动'}</strong></div>
            </div>
        </section>
    `;
}

function createConfigWorkbench(): string {
    const currentAI = normalizeAIType(CONFIG.exam.currentAI);
    const aiConfig = getAIConfig();
    const preset = AI_PRESETS[currentAI];
    const aiOptions = Object.entries(AI_PRESETS).map(([key, option]) => {
        const selected = currentAI === key ? 'selected' : '';
        return `<option value="${key}" ${selected}>${option.name}</option>`;
    }).join('');

    return `
        <section class="workbench-task" data-task-panel="config">
            <section class="config-card">
                <div class="config-card-head">
                    <h2>配置</h2>
                    <span class="config-pill">${preset.name}</span>
                </div>

                <div class="config-rows">
                    <div class="config-row">
                        <div class="config-row-title">学习</div>
                        <div class="config-fields config-fields-learning">
                            <label class="field">
                                <span>倍速</span>
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
                            </label>
                            <label class="field">
                                <span>等待</span>
                                <div class="input-with-unit">
                                    <input type="number" id="learning-wait-time" class="input-control" value="${CONFIG.learning.waitTimeAfterComplete}" min="1" max="30">
                                    <span class="unit">秒</span>
                                </div>
                            </label>
                            <label class="field">
                                <span>翻页</span>
                                <div class="input-with-unit">
                                    <input type="number" id="learning-doc-interval" class="input-control" value="${CONFIG.learning.documentPageInterval}" min="1" max="60">
                                    <span class="unit">秒</span>
                                </div>
                            </label>
                            <label class="field">
                                <span>展开</span>
                                <div class="input-with-unit">
                                    <input type="number" id="learning-expand-delay" class="input-control" value="${CONFIG.learning.expandDelay}" min="1" max="10" step="0.5">
                                    <span class="unit">秒</span>
                                </div>
                            </label>
                            <label class="field toggle-field">
                                <span>静音</span>
                                <input type="checkbox" id="learning-mute-media" ${CONFIG.learning.muteMedia ? 'checked' : ''}>
                            </label>
                        </div>
                    </div>

                    <div class="config-row">
                        <div class="config-row-title">答题</div>
                        <div class="config-fields config-fields-exam">
                            <label class="field">
                                <span>间隔</span>
                                <div class="input-with-unit">
                                    <input type="number" id="exam-delay" class="input-control" value="${CONFIG.exam.delay / 1000}" min="2" max="15">
                                    <span class="unit">秒</span>
                                </div>
                            </label>
                            <label class="field toggle-field">
                                <span>交卷</span>
                                <input type="checkbox" id="exam-auto-submit" ${CONFIG.exam.autoSubmit ? 'checked' : ''}>
                            </label>
                        </div>
                    </div>

                    <div class="config-row config-row-ai">
                        <div class="config-row-title">AI</div>
                        <div class="config-fields config-fields-ai">
                            <label class="field">
                                <span>服务</span>
                                <select id="exam-ai-model" class="select-control">${aiOptions}</select>
                            </label>
                            <label class="field">
                                <span>模型</span>
                                <input type="text" id="exam-api-model-name" class="input-control" value="${aiConfig.model}" placeholder="model-name">
                            </label>
                            <label class="field field-full">
                                <span>地址</span>
                                <input type="text" id="exam-api-url" class="input-control" value="${aiConfig.baseURL}" placeholder="https://api.example.com/v1">
                            </label>
                            <label class="field field-full">
                                <span>密钥</span>
                                <div class="api-key-input-wrap">
                                    <input type="password" id="exam-api-key" class="input-control" value="${aiConfig.apiKey}" placeholder="${preset.keyPlaceholder}" autocomplete="off">
                                    <button type="button" class="api-key-toggle" id="exam-toggle-api-key" title="显示密钥">显示</button>
                                </div>
                            </label>
                            <div class="config-test-cell">
                                <button class="btn btn-secondary config-test-action" id="exam-test-ai-config">测试</button>
                                <span class="config-test-status" id="exam-test-ai-status" role="status">未测试</span>
                            </div>
                        </div>
                    </div>

                    <div class="config-row config-row-actions">
                        <div class="config-row-title">管理</div>
                        <div class="config-actions">
                            <button class="btn btn-outline btn-sm" id="export-config" title="导出当前配置">导出</button>
                            <button class="btn btn-outline btn-sm" id="import-config" title="导入配置文件">导入</button>
                            <button class="btn btn-outline btn-sm btn-danger" id="reset-config" title="恢复默认配置">重置</button>
                            <button class="btn btn-outline btn-sm" id="show-guide" title="显示使用指南">指南</button>
                        </div>
                    </div>
                </div>
            </section>
        </section>
    `;
}

function createPanel(): void {
    const panel = document.createElement('div');
    panel.id = 'icve-tabbed-panel';

    const pageType = getPageType();
    const defaultTask = getDefaultTask(pageType);
    const isOpen = localStorage.getItem('icve_workbench_open') === 'true';
    panel.className = isOpen ? 'is-open' : 'is-collapsed';
    panel.dataset.task = defaultTask;

    panel.innerHTML = `
        ${createLauncher(defaultTask)}
        <div class="panel-container" id="icve-workbench" aria-hidden="${isOpen ? 'false' : 'true'}">
            <div class="panel-header" id="panel-header">
                <span class="panel-title">智慧职教助手</span>
                <div class="header-controls">
                    <button class="theme-toggle" id="theme-toggle" title="切换主题">浅/深</button>
                    <button class="panel-toggle" id="panel-toggle" title="收起">−</button>
                </div>
            </div>

            <main class="workbench-body">
                ${createTaskSwitcher(pageType, defaultTask)}
                <div class="workbench-task-stack">
                    ${(pageType === 'learning' || pageType === 'all') ? createLearningWorkbench() : ''}
                    ${(pageType === 'exam' || pageType === 'all') ? createExamWorkbench() : ''}
                    ${createConfigWorkbench()}
                </div>

                <section class="recent-events">
                    <div class="recent-events-head">
                        <div class="section-kicker">日志</div>
                        <button type="button" class="recent-clear-btn" id="clear-recent-events">清空</button>
                    </div>
                    <div id="recent-events-list">
                        <div class="recent-placeholder">暂无事件</div>
                    </div>
                </section>
            </main>
        </div>
    `;

    panel.querySelectorAll<HTMLElement>('[data-task-panel]').forEach(taskPanel => {
        taskPanel.hidden = taskPanel.dataset.taskPanel !== defaultTask;
    });

    panel.querySelectorAll<HTMLButtonElement>('[data-task-select]').forEach(button => {
        button.classList.toggle('active', button.dataset.taskSelect === defaultTask);
    });

    // 添加样式
    addStyles();
    addExtraStyles();

    document.body.appendChild(panel);

    // 绑定事件
    bindEvents();

    // 应用主题
    applyTheme(CONFIG.theme);

    // 加载学习进度
    loadLearningProgress();
    updateRecentEvents();
    updateLauncherStatus();

    // 显示新手引导（首次使用时）
    setTimeout(() => {
        showGuide();
    }, 500);
}

// 添加额外样式
function addExtraStyles(): void {
    const style = document.createElement('style');
    style.textContent = getGuideStyles() + getUIUtilsStyles();
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

    Logger.info('事件绑定完成');
}

function updateRecentEvents(): void {
    const list = document.getElementById('recent-events-list');
    if (!list) return;

    const recentLogs = Logger._logs.slice(-8).reverse();
    if (recentLogs.length === 0) {
        list.innerHTML = '<div class="recent-placeholder">暂无事件</div>';
        return;
    }

    list.innerHTML = recentLogs.map(log => `
        <div class="recent-event recent-${log.type}">
            <span>${log.time}</span>
            <strong>${log.message}</strong>
        </div>
    `).join('');
}

// 统一处理点击事件
async function handlePanelClick(e: Event): Promise<void> {
    const target = e.target as HTMLElement;
    const id = target.id || target.closest('[id]')?.id;

    if (id === 'icve-launcher' && suppressLauncherOpen) {
        suppressLauncherOpen = false;
        e.preventDefault();
        return;
    }

    // 使用对象映射提升性能
    const actionMap: Record<string, () => void | Promise<void>> = {
        'icve-launcher': openWorkbench,
        'theme-toggle': toggleTheme,
        'panel-toggle': closeWorkbench,
        'learning-start': startLearning,
        'learning-scan': scanLearningNodes,
        'learning-reset': handleResetLearning,
        'exam-start': handleStartExam,
        'exam-stop': stopExam,
        'exam-test-ai': handleTestAIConfig,
        'exam-test-ai-config': handleTestAIConfig,
        'exam-toggle-api-key': toggleApiKeyVisibility,
        'clear-recent-events': Logger.clearPageLog.bind(Logger),
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

    const taskBtn = target.closest('[data-task-select]') as HTMLElement | null;
    if (taskBtn?.dataset.taskSelect) {
        switchTask(taskBtn.dataset.taskSelect as TaskType);
        return;
    }
}

async function handleStartExam(): Promise<void> {
    saveCurrentAIInputs();
    await startExam();
}

async function handleTestAIConfig(): Promise<void> {
    const testBtns = [
        document.getElementById('exam-test-ai') as HTMLButtonElement | null,
        document.getElementById('exam-test-ai-config') as HTMLButtonElement | null
    ].filter(Boolean) as HTMLButtonElement[];
    const configTestBtn = document.getElementById('exam-test-ai-config') as HTMLButtonElement | null;
    const configStatus = document.getElementById('exam-test-ai-status');
    saveCurrentAIInputs();
    updateAIProfileSummary();

    if (configStatus) {
        configStatus.textContent = '测试中';
        configStatus.title = '正在测试 AI 配置';
        configStatus.className = 'config-test-status is-pending';
    }
    testBtns.forEach(button => {
        button.disabled = true;
        button.textContent = button === configTestBtn ? '测试中' : '测试中...';
    });

    updateExamMessage('正在测试 AI 配置...', '#2196F3');
    const result = await testAIConnection();

    if (result.success) {
        updateExamMessage(`✅ ${result.message}`, '#10b981');
        Logger.success(`AI 配置测试通过: ${result.message}`);
        if (configStatus) {
            configStatus.textContent = '通过';
            configStatus.title = result.message;
            configStatus.className = 'config-test-status is-success';
        }
    } else {
        updateExamMessage(`❌ ${result.message}`, '#ef4444');
        Logger.error(`AI 配置测试失败: ${result.message}`);
        if (configStatus) {
            configStatus.textContent = result.message;
            configStatus.title = result.message;
            configStatus.className = 'config-test-status is-error';
        }
    }

    testBtns.forEach(button => {
        button.disabled = false;
        button.textContent = button === configTestBtn ? '测试' : '测试 AI';
    });
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
            refreshQuickSettings();
            break;

        case 'learning-wait-time':
            CONFIG.learning.waitTimeAfterComplete = parseInt(value as string);
            saveConfig();
            Logger.info(`完成等待时间: ${value}秒`);
            refreshQuickSettings();
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
            refreshQuickSettings();
            break;

        // 答题配置
        case 'exam-ai-model':
            CONFIG.exam.currentAI = normalizeAIType(value as string);
            const preset = AI_PRESETS[CONFIG.exam.currentAI];
            const aiConfig = getAIConfig();

            // 更新输入框
            const apiKeyInputs = document.querySelectorAll<HTMLInputElement>('#exam-api-key');
            const apiUrlInputs = document.querySelectorAll<HTMLInputElement>('#exam-api-url');
            const modelInputs = document.querySelectorAll<HTMLInputElement>('#exam-api-model-name');

            apiKeyInputs.forEach(apiKeyInput => {
                apiKeyInput.value = aiConfig.apiKey;
                apiKeyInput.placeholder = preset.keyPlaceholder;
            });
            apiUrlInputs.forEach(apiUrlInput => { apiUrlInput.value = aiConfig.baseURL; });
            modelInputs.forEach(modelInput => { modelInput.value = aiConfig.model; });
            updateAIProfileSummary();

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
            GM_setValue(`ai_key_${normalizeAIType(CONFIG.exam.currentAI)}`, (value as string).trim());
            document.querySelectorAll<HTMLInputElement>('#exam-api-key').forEach(input => {
                if (input !== target) input.value = (value as string).trim();
            });
            updateExamMessage('API Key已保存', '#10b981');
            setTimeout(() => {
                const aiType = normalizeAIType(CONFIG.exam.currentAI);
                updateExamMessage(`就绪（使用 ${AI_PRESETS[aiType].name}）`, '#64748b');
            }, 2000);
            Logger.info('API Key已更新');
            break;

        case 'exam-api-url':
            GM_setValue(`ai_baseurl_${normalizeAIType(CONFIG.exam.currentAI)}`, (value as string).trim());
            document.querySelectorAll<HTMLInputElement>('#exam-api-url').forEach(input => {
                if (input !== target) input.value = (value as string).trim();
            });
            updateAIProfileSummary();
            updateExamMessage('API地址已保存', '#10b981');
            setTimeout(() => {
                const aiType = normalizeAIType(CONFIG.exam.currentAI);
                updateExamMessage(`就绪（使用 ${AI_PRESETS[aiType].name}）`, '#64748b');
            }, 2000);
            Logger.info(`API地址已更新`);
            break;

        case 'exam-api-model-name':
            GM_setValue(`ai_model_${normalizeAIType(CONFIG.exam.currentAI)}`, (value as string).trim());
            document.querySelectorAll<HTMLInputElement>('#exam-api-model-name').forEach(input => {
                if (input !== target) input.value = (value as string).trim();
            });
            updateAIProfileSummary();
            updateExamMessage('模型名称已保存', '#10b981');
            setTimeout(() => {
                const aiType = normalizeAIType(CONFIG.exam.currentAI);
                updateExamMessage(`就绪（使用 ${AI_PRESETS[aiType].name}）`, '#64748b');
            }, 2000);
            Logger.info(`模型名称: ${(value as string).trim()}`);
            break;

        case 'exam-delay':
            CONFIG.exam.delay = parseInt(value as string) * 1000;
            saveConfig();
            Logger.info(`答题间隔: ${value}秒`);
            refreshQuickSettings();
            break;

        case 'exam-auto-submit':
            CONFIG.exam.autoSubmit = value as boolean;
            saveConfig();
            Logger.info(`自动交卷: ${value ? '开启' : '关闭'}`);
            refreshQuickSettings();
            break;
    }
}

// ==================== 工具函数 ====================

function openWorkbench(): void {
    const panel = DOMCache.getById('icve-tabbed-panel');
    const workbench = DOMCache.getById('icve-workbench');
    if (!panel || !workbench) return;

    panel.classList.add('is-open');
    panel.classList.remove('is-collapsed');
    workbench.setAttribute('aria-hidden', 'false');
    localStorage.setItem('icve_workbench_open', 'true');
    requestAnimationFrame(() => ensurePanelInViewport());
}

function closeWorkbench(): void {
    const panel = DOMCache.getById('icve-tabbed-panel');
    const workbench = DOMCache.getById('icve-workbench');
    if (!panel || !workbench) return;

    panel.classList.remove('is-open');
    panel.classList.add('is-collapsed');
    workbench.setAttribute('aria-hidden', 'true');
    localStorage.setItem('icve_workbench_open', 'false');
    requestAnimationFrame(() => ensurePanelInViewport());
}

function switchTask(task: TaskType): void {
    const panel = DOMCache.getById('icve-tabbed-panel');
    if (!panel) return;

    panel.dataset.task = task;
    panel.querySelectorAll<HTMLElement>('[data-task-panel]').forEach(taskPanel => {
        taskPanel.hidden = taskPanel.dataset.taskPanel !== task;
    });
    panel.querySelectorAll<HTMLButtonElement>('[data-task-select]').forEach(button => {
        button.classList.toggle('active', button.dataset.taskSelect === task);
    });
    updateLauncherStatus();
}

function saveCurrentAIInputs(): void {
    const aiType = normalizeAIType(CONFIG.exam.currentAI);
    CONFIG.exam.currentAI = aiType;

    const apiKeyInput = document.querySelector<HTMLInputElement>('#exam-api-key');
    const apiUrlInput = document.querySelector<HTMLInputElement>('#exam-api-url');
    const modelInput = document.querySelector<HTMLInputElement>('#exam-api-model-name');

    if (apiKeyInput) {
        GM_setValue(`ai_key_${aiType}`, apiKeyInput.value.trim());
    }
    if (apiUrlInput) {
        GM_setValue(`ai_baseurl_${aiType}`, apiUrlInput.value.trim());
    }
    if (modelInput) {
        GM_setValue(`ai_model_${aiType}`, modelInput.value.trim());
    }
    saveConfig();
}

function updateAIProfileSummary(): void {
    const aiType = normalizeAIType(CONFIG.exam.currentAI);
    const preset = AI_PRESETS[aiType];
    const aiConfig = getAIConfig();
    const serviceEls = document.querySelectorAll<HTMLElement>('#exam-ai-service-name');
    const modelEls = document.querySelectorAll<HTMLElement>('#exam-ai-service-model');
    const configPills = document.querySelectorAll<HTMLElement>('.config-pill');

    serviceEls.forEach(serviceEl => {
        serviceEl.textContent = preset.name;
    });
    configPills.forEach(configPill => {
        configPill.textContent = preset.name;
    });
    modelEls.forEach(modelEl => {
        const baseURL = aiConfig.baseURL || '未配置地址';
        const model = aiConfig.model || '未配置模型';
        modelEl.textContent = model;
        modelEl.title = baseURL;
    });
    refreshQuickSettings();
}

function refreshQuickSettings(): void {
    const learningQuick = document.querySelector<HTMLElement>('[data-task-panel="learning"] .quick-settings');
    if (learningQuick) {
        learningQuick.innerHTML = `
            <div><span>倍速</span><strong>${CONFIG.learning.playbackRate}x</strong></div>
            <div><span>等待</span><strong>${CONFIG.learning.waitTimeAfterComplete} 秒</strong></div>
            <div><span>静音</span><strong>${CONFIG.learning.muteMedia ? '开' : '关'}</strong></div>
        `;
    }

    const examQuick = document.querySelector<HTMLElement>('[data-task-panel="exam"] .quick-settings');
    if (examQuick) {
        const aiType = normalizeAIType(CONFIG.exam.currentAI);
        const preset = AI_PRESETS[aiType];
        examQuick.innerHTML = `
            <div><span>服务</span><strong>${preset.name}</strong></div>
            <div><span>延迟</span><strong>${CONFIG.exam.delay / 1000} 秒</strong></div>
            <div><span>交卷</span><strong>${CONFIG.exam.autoSubmit ? '自动' : '手动'}</strong></div>
        `;
    }
}

function updateLauncherStatus(): void {
    const launcherMeta = document.querySelector<HTMLElement>('#icve-launcher .launcher-meta');
    const launcherDot = document.querySelector<HTMLElement>('#icve-launcher .launcher-dot');
    if (!launcherMeta || !launcherDot) return;

    launcherDot.classList.remove('running', 'error');
    if (state.learning.isRunning) {
        launcherMeta.textContent = `学习中 ${state.learning.completedCount}/${state.learning.totalCount}`;
        launcherDot.classList.add('running');
        return;
    }
    if (state.exam.isRunning) {
        launcherMeta.textContent = `答题中 ${state.exam.currentQuestionIndex}/${state.exam.totalQuestions}`;
        launcherDot.classList.add('running');
        return;
    }

    const task = (document.getElementById('icve-tabbed-panel')?.dataset.task as TaskType | undefined) || getDefaultTask(getPageType());
    const idleText: Record<TaskType, string> = {
        learning: '学习就绪',
        exam: '答题就绪',
        config: '配置'
    };
    launcherMeta.textContent = idleText[task] || '学习就绪';
}

function toggleApiKeyVisibility(): void {
    const apiKeyInputs = document.querySelectorAll<HTMLInputElement>('#exam-api-key');
    const toggleButtons = document.querySelectorAll<HTMLButtonElement>('#exam-toggle-api-key');
    const firstInput = apiKeyInputs[0];
    if (!firstInput) return;

    const shouldShow = firstInput.type === 'password';
    apiKeyInputs.forEach(input => {
        input.type = shouldShow ? 'text' : 'password';
    });
    toggleButtons.forEach(button => {
        button.textContent = shouldShow ? '隐藏' : '显示';
        button.title = shouldShow ? '隐藏密钥' : '显示密钥';
    });
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

// 使面板可拖动（带边界检测和位置持久化）
function makeDraggable(): void {
    const panel = DOMCache.getById('icve-tabbed-panel');
    const header = DOMCache.getById('panel-header');
    const launcher = DOMCache.getById('icve-launcher');
    if (!panel || !header) return;

    let isDragging = false;
    let initialX = 0;
    let initialY = 0;
    let startX = 0;
    let startY = 0;
    let hasMoved = false;
    let dragSource: DragSource | null = null;
    const dragThreshold = 4;

    // 恢复保存的位置
    restorePanelPosition();

    const startDrag = (e: MouseEvent, source: DragSource) => {
        // 忽略按钮点击
        if (source === 'header' && (e.target as HTMLElement).closest('button')) return;

        const rect = panel.getBoundingClientRect();
        initialX = e.clientX - rect.left;
        initialY = e.clientY - rect.top;
        startX = e.clientX;
        startY = e.clientY;
        isDragging = true;
        hasMoved = false;
        dragSource = source;
        panel.style.transition = 'none'; // 拖动时禁用过渡动画
    };

    header.addEventListener('mousedown', (e: MouseEvent) => startDrag(e, 'header'));
    launcher?.addEventListener('mousedown', (e: MouseEvent) => startDrag(e, 'launcher'));

    document.addEventListener('mousemove', (e: MouseEvent) => {
        if (!isDragging) return;

        const deltaX = e.clientX - startX;
        const deltaY = e.clientY - startY;
        if (!hasMoved && Math.hypot(deltaX, deltaY) < dragThreshold) return;

        e.preventDefault();
        hasMoved = true;

        const panelRect = panel.getBoundingClientRect();
        const viewportWidth = window.innerWidth;
        const viewportHeight = window.innerHeight;

        // 计算新位置
        let newX = e.clientX - initialX;
        let newY = e.clientY - initialY;

        // 边界检测 - 折叠入口保持更多可见区域，避免拖到屏幕边缘后难以找回
        const minVisibleX = dragSource === 'launcher' ? Math.min(180, panelRect.width) : 50;
        const minVisibleY = dragSource === 'launcher' ? Math.min(48, panelRect.height) : 50;
        const maxX = viewportWidth - minVisibleX;
        const maxY = viewportHeight - minVisibleY;
        const minX = minVisibleX - panelRect.width;
        const minY = 0; // 顶部不能超出

        newX = Math.max(minX, Math.min(newX, maxX));
        newY = Math.max(minY, Math.min(newY, maxY));

        panel.style.left = newX + 'px';
        panel.style.top = newY + 'px';
        panel.style.right = 'auto';
    });

    document.addEventListener('mouseup', () => {
        if (isDragging) {
            if (hasMoved) {
                if (dragSource === 'launcher') {
                    suppressLauncherOpen = true;
                    window.setTimeout(() => {
                        suppressLauncherOpen = false;
                    }, 250);
                }
                // 保存位置
                savePanelPosition();
            }
            panel.style.transition = ''; // 恢复过渡动画
        }
        isDragging = false;
        dragSource = null;
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
    const isCollapsed = panel.classList.contains('is-collapsed');
    const minVisibleX = isCollapsed ? Math.min(180, rect.width) : 50;
    const minVisibleY = isCollapsed ? Math.min(48, rect.height) : 50;

    let needsUpdate = false;
    let newLeft = rect.left;
    let newTop = rect.top;

    // 检查右边界
    if (rect.left > viewportWidth - minVisibleX) {
        newLeft = viewportWidth - minVisibleX;
        needsUpdate = true;
    }
    // 检查左边界
    if (rect.right < minVisibleX) {
        newLeft = minVisibleX - rect.width;
        needsUpdate = true;
    }
    // 检查下边界
    if (rect.top > viewportHeight - minVisibleY) {
        newTop = viewportHeight - minVisibleY;
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

window.updateRecentEvents = updateRecentEvents;

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
