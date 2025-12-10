/**
 * 学习模块 - 完整功能
 */

import { state, saveLearningProgress } from '../utils/state';
import { Logger } from '../utils/logger';
import { Utils } from '../utils/index';
import { CONFIG } from '../ui/config-instance';
import { ErrorHandler } from '../utils/error-handler';
import { DOMCache } from '../utils/dom-cache';
import type { LearningNode, PageInfo } from '../types/index';

// 媒体进度更新节流时间（毫秒）
const MEDIA_PROGRESS_THROTTLE = 500;

/**
 * 检查节点是否是考试/测验类型
 */
export function isExamNode(nodeElement: HTMLElement): boolean {
    const examButton = nodeElement.querySelector('.li_action .btn_dt');
    if (examButton) {
        const btnText = examButton.textContent?.trim() || '';
        if (btnText.includes('开始答题') || btnText.includes('答题') || btnText.includes('考试') || btnText.includes('测验')) {
            return true;
        }
    }
    return false;
}

/**
 * 扫描学习节点
 */
export function scanLearningNodes(): void {
    const nodes = document.querySelectorAll('.panelList .node');
    state.learning.allNodes = [];
    state.learning.completedCount = 0;
    state.learning.examCount = 0;
    state.learning.totalCount = nodes.length;

    nodes.forEach((node, index) => {
        const nodeElement = node as HTMLElement;
        const titleElement = nodeElement.querySelector('.title');
        const statusIcon = nodeElement.querySelector('.jd');
        const title = titleElement ? titleElement.textContent?.trim() || `节点${index + 1}` : `节点${index + 1}`;
        const id = nodeElement.id;
        const isCompleted = (statusIcon && statusIcon.classList.contains('wc')) || state.learning.processedNodes.has(id);

        const isExam = isExamNode(nodeElement);
        if (isExam) {
            state.learning.examCount++;
        }

        state.learning.allNodes.push({
            element: nodeElement,
            id: id,
            title: title,
            isCompleted: isCompleted,
            isExam: isExam,
            index: index
        });

        if (isCompleted) {
            state.learning.completedCount++;
        }
    });

    const uncompletedCount = state.learning.totalCount - state.learning.completedCount;
    Logger.info(`扫描完成: 共${state.learning.totalCount}个节点, 已完成${state.learning.completedCount}个, 待学习${uncompletedCount}个`);
    if (state.learning.examCount > 0) {
        Logger.info(`发现${state.learning.examCount}个考试节点(将自动跳过)`);
    }

    updateLearningStatus();
}

/**
 * 更新学习状态显示
 */
export function updateLearningStatus(): void {
    const progressText = `${state.learning.completedCount}/${state.learning.totalCount}`;

    // 使用 DOMCache 优化 DOM 操作
    const progressElement = DOMCache.getById('learning-progress');
    if (progressElement) {
        progressElement.textContent = progressText;
        progressElement.title = state.learning.examCount > 0
            ? `跳过 ${state.learning.examCount} 个考试/测验节点`
            : '';
    }

    DOMCache.setText('learning-processed', String(state.learning.processedNodes.size));

    const currentElement = DOMCache.getById('learning-current');
    if (currentElement) {
        if (state.learning.currentNode && state.learning.currentNode.title) {
            const shortTitle = state.learning.currentNode.title.length > 18
                ? state.learning.currentNode.title.substring(0, 18) + '...'
                : state.learning.currentNode.title;
            currentElement.textContent = shortTitle;
            currentElement.title = state.learning.currentNode.title;
        } else {
            currentElement.textContent = '无';
            currentElement.title = '';
        }
    }
}

/**
 * 应用播放倍速
 */
export function applyPlaybackRate(): void {
    const mediaElements: HTMLMediaElement[] = [
        ...Array.from(document.querySelectorAll('audio')),
        ...Array.from(document.querySelectorAll('video'))
    ];
    mediaElements.forEach(media => {
        media.playbackRate = CONFIG.learning.playbackRate;
    });
}

/**
 * 应用静音设置
 */
export function applyMuteToCurrentMedia(): void {
    const mediaElements: HTMLMediaElement[] = [
        ...Array.from(document.querySelectorAll('audio')),
        ...Array.from(document.querySelectorAll('video'))
    ];
    mediaElements.forEach(media => {
        media.muted = CONFIG.learning.muteMedia;
    });
}

/**
 * 重置学习进度
 */
export function resetLearning(): void {
    state.learning.processedNodes.clear();
    if (state.learning.completedChapters) {
        state.learning.completedChapters.clear();
    }
    saveLearningProgress();
    scanLearningNodes();
    Logger.warn('已重置所有学习进度');
}

/**
 * 更新学习进度文本
 */
export function updateLearningProgressText(text: string): void {
    const progressText = document.getElementById('learning-progress-text');
    if (progressText) {
        progressText.textContent = text;
    }
}

/**
 * 通过API获取章节内容
 */
export async function fetchChapterContentByAPI(chapterId: string): Promise<unknown | null> {
    try {
        const urlParams = new URLSearchParams(window.location.search);
        const courseInfoId = urlParams.get('courseInfoId');
        const courseId = urlParams.get('courseId');

        if (!courseInfoId || !courseId) {
            Logger.warn('无法获取课程参数，跳过 API 预加载');
            return null;
        }

        const apiUrl = `https://ai.icve.com.cn/prod-api/course/courseDesign/getCellList?courseInfoId=${courseInfoId}&courseId=${courseId}&parentId=${chapterId}`;

        const response = await fetch(apiUrl, {
            method: 'GET',
            headers: {
                'Accept': 'application/json, text/plain, */*',
                'Content-Type': 'application/json'
            },
            credentials: 'include'
        });

        if (!response.ok) {
            Logger.warn(`章节内容 API 返回 ${response.status}，将使用点击方式展开`);
            return null;
        }

        const data = await response.json();
        return data;

    } catch (error) {
        // 静默处理，因为这只是预加载优化，失败不影响主流程
        ErrorHandler.handle(error as Error, '获取章节内容', true);
        return null;
    }
}

/**
 * 查找并展开下一个未完成的章节
 */
export async function expandNextUncompletedSection(): Promise<boolean> {
    updateLearningProgressText('🔍 正在查找下一个章节...');

    const sections = document.querySelectorAll('.one > .draggablebox > span > .collapse-panel');

    for (const section of Array.from(sections)) {
        const sectionElement = section as HTMLElement;
        const panelTitle = sectionElement.querySelector('.panel-title');
        const panelContent = sectionElement.querySelector('.panel-content') as HTMLElement | null;

        if (!panelTitle || !panelContent) continue;

        // 如果章节是展开的，检查是否所有子节点都完成了
        if (panelContent.style.display !== 'none') {
            const nodes = sectionElement.querySelectorAll('.panelList .node');

            if (nodes.length > 0) {
                const allCompleted = Array.from(nodes).every(node => {
                    const nodeElement = node as HTMLElement;
                    const statusIcon = nodeElement.querySelector('.jd');
                    const id = nodeElement.id;
                    const isExam = isExamNode(nodeElement);
                    return (statusIcon && statusIcon.classList.contains('wc')) || state.learning.processedNodes.has(id) || isExam;
                });

                if (allCompleted) {
                    const chapterId = sectionElement.id;

                    if (!state.learning.completedChapters) {
                        state.learning.completedChapters = new Set();
                    }
                    state.learning.completedChapters.add(chapterId);
                    saveLearningProgress();

                    continue;
                } else {
                    return false;
                }
            }
        }
        // 如果章节是折叠的
        else {
            const chapterId = sectionElement.id;

            if (state.learning.completedChapters && state.learning.completedChapters.has(chapterId)) {
                continue;
            }

            const titleText = (panelTitle.textContent?.trim() || '').substring(0, 40);
            updateLearningProgressText(`📂 正在展开新章节：${titleText}...`);

            // 方法1: 先通过API获取内容
            await fetchChapterContentByAPI(chapterId);
            await Utils.sleep(500);

            // 方法2: 点击箭头图标展开
            const arrow = panelTitle.querySelector('.jiantou') as HTMLElement | null;
            if (arrow) {
                arrow.click();
                await Utils.sleep(800);
            }

            // 等待DOM更新
            await Utils.sleep(2000);

            // 多次检查节点是否出现
            let nodes = sectionElement.querySelectorAll('.panelList .node');
            let retryCount = 0;
            const maxRetries = 5;

            while (nodes.length === 0 && retryCount < maxRetries) {
                await Utils.sleep(1500);
                nodes = sectionElement.querySelectorAll('.panelList .node');
                retryCount++;

                if (nodes.length === 0 && retryCount === 2) {
                    const retryArrow = panelTitle.querySelector('.jiantou') as HTMLElement | null;
                    if (retryArrow) {
                        retryArrow.click();
                        await Utils.sleep(1000);
                    }
                }
            }

            updateLearningProgressText(`✅ 章节展开成功，发现 ${nodes.length} 个节点`);
            Logger.info(`展开新章节: 发现${nodes.length}个节点`);

            if (nodes.length > 0) {
                return true;
            } else {
                if (!state.learning.completedChapters) {
                    state.learning.completedChapters = new Set();
                }
                state.learning.completedChapters.add(chapterId);
                saveLearningProgress();
                continue;
            }
        }
    }

    return false;
}

/**
 * 检测文档页码
 */
export function getDocumentPageInfo(): PageInfo | null {
    const pageDiv = document.querySelector('.page');
    if (!pageDiv) return null;

    const match = pageDiv.textContent?.match(/(\d+)\s*\/\s*(\d+)/);
    if (match) {
        return {
            current: parseInt(match[1]),
            total: parseInt(match[2])
        };
    }
    return null;
}

/**
 * 点击下一页
 */
export function clickNextPage(): boolean {
    const buttons = document.querySelectorAll('.page button');
    for (const btn of Array.from(buttons)) {
        const span = btn.querySelector('span');
        if (span && span.textContent?.includes('下一页')) {
            (btn as HTMLElement).click();
            return true;
        }
    }
    return false;
}

/**
 * 处理文档类型内容
 */
export function handleDocument(): void {
    const pageInfo = getDocumentPageInfo();

    if (pageInfo) {
        state.learning.currentPage = pageInfo.current;
        state.learning.totalPages = pageInfo.total;

        // 更新进度条
        const percentage = (pageInfo.current / pageInfo.total) * 100;
        Utils.updateProgressBar('learning-progress-bar', percentage);

        // 更新进度文本
        updateLearningProgressText(`文档: 第 ${pageInfo.current}/${pageInfo.total} 页`);

        if (pageInfo.current < pageInfo.total) {
            // 还有下一页
            setTimeout(() => {
                if (clickNextPage()) {
                    setTimeout(() => {
                        handleDocument();
                    }, 2000);
                }
            }, CONFIG.learning.documentPageInterval * 1000);
        } else {
            // 文档已经看完
            updateLearningProgressText('文档已浏览完成');
            Logger.success(`文档浏览完成(共${pageInfo.total}页)`);
            state.learning.isDocument = false;

            // 重置进度条
            setTimeout(() => {
                Utils.resetProgressBar('learning-progress-bar');
            }, 1000);

            // 标记当前节点为已处理
            if (state.learning.currentNode && state.learning.currentNode.id) {
                state.learning.processedNodes.add(state.learning.currentNode.id);
                saveLearningProgress();
                updateLearningStatus();
            }

            if (state.learning.isRunning) {
                setTimeout(() => {
                    goToNextNode();
                }, CONFIG.learning.waitTimeAfterComplete * 1000);
            }
        }
    } else {
        // 没有分页信息，可能是单页文档
        updateLearningProgressText('单页文档已浏览');
        Logger.success('单页文档浏览完成');
        state.learning.isDocument = false;

        // 标记当前节点为已处理
        if (state.learning.currentNode && state.learning.currentNode.id) {
            state.learning.processedNodes.add(state.learning.currentNode.id);
            saveLearningProgress();
            updateLearningStatus();
        }

        if (state.learning.isRunning) {
            setTimeout(() => {
                goToNextNode();
            }, CONFIG.learning.waitTimeAfterComplete * 1000);
        }
    }
}

/**
 * 隐藏"继续播放"提示框
 */
function hideContinuePlayDialog(): boolean {
    const dialogs = document.querySelectorAll('.el-message-box__wrapper');
    for (const dialog of Array.from(dialogs)) {
        const dialogElement = dialog as HTMLElement;
        // 检查是否可见
        if (dialogElement.style.display === 'none') continue;

        // 检查是否包含"继续播放"相关内容
        const dialogText = (dialogElement.textContent || '').replace(/\s+/g, ' ');
        if (dialogText.includes('继续播放') ||
            (dialogText.includes('是否继续') && dialogText.includes('播放'))) {

            // 直接隐藏提示框
            dialogElement.style.display = 'none';
            Logger.info('已隐藏"继续播放"提示框');
            return true;
        }
    }
    return false;
}

/**
 * 播放媒体
 */
export function playMedia(mediaElements: HTMLMediaElement[]): void {
    mediaElements.forEach((media) => {
        if ((media as HTMLMediaElement & { dataset: { processed?: string } }).dataset.processed) return;
        (media as HTMLMediaElement & { dataset: { processed?: string } }).dataset.processed = 'true';

        const mediaType = media.tagName.toLowerCase() === 'video' ? '视频' : '音频';

        // 设置播放倍速
        media.playbackRate = CONFIG.learning.playbackRate;

        // 设置静音
        media.muted = CONFIG.learning.muteMedia;

        // 更新进度文本
        updateLearningProgressText(`${mediaType}播放中...`);

        // 创建节流的进度更新函数
        let lastUpdateTime = 0;
        const throttledProgressUpdate = (): void => {
            const now = Date.now();
            if (now - lastUpdateTime < MEDIA_PROGRESS_THROTTLE) return;
            lastUpdateTime = now;

            if (media.duration > 0) {
                const current = media.currentTime;
                const total = media.duration;
                const percentage = (current / total) * 100;

                // 更新进度条
                Utils.updateProgressBar('learning-progress-bar', percentage);

                // 更新进度文本
                updateLearningProgressText(`${mediaType}: ${Utils.formatTime(current)} / ${Utils.formatTime(total)}`);
            }
        };

        // 监听播放进度（使用节流）
        media.addEventListener('timeupdate', throttledProgressUpdate);

        // 监听播放结束
        media.addEventListener('ended', () => {
            state.learning.mediaWatching = false;

            Logger.success(`${mediaType}播放完成`);

            // 标记当前节点为已处理
            if (state.learning.currentNode && state.learning.currentNode.id) {
                state.learning.processedNodes.add(state.learning.currentNode.id);
                saveLearningProgress();
                updateLearningStatus();
            }

            // 重置进度条
            Utils.resetProgressBar('learning-progress-bar');
            updateLearningProgressText(`${mediaType}已完成`);

            if (state.learning.isRunning) {
                setTimeout(() => {
                    goToNextNode();
                }, CONFIG.learning.waitTimeAfterComplete * 1000);
            }
        });

        // 自动播放
        state.learning.mediaWatching = true;
        media.play().catch(err => {
            state.learning.mediaWatching = false;
            Logger.error('媒体播放失败: ' + err.message);
        });
    });
}

/**
 * 检测内容类型并处理
 */
export function detectContentType(): void {
    // 首先检查是否是考试/测验页面
    const examButton = document.querySelector('.li_action .btn_dt, .btn_dt');
    if (examButton) {
        const btnText = examButton.textContent?.trim() || '';
        if (btnText.includes('开始答题') || btnText.includes('答题') ||
            btnText.includes('考试') || btnText.includes('测验')) {
            updateLearningProgressText('⏭️ 检测到考试页面，已跳过');
            Logger.warn('跳过考试节点');

            // 标记当前节点为已处理
            if (state.learning.currentNode && state.learning.currentNode.id) {
                state.learning.processedNodes.add(state.learning.currentNode.id);
                saveLearningProgress();
                updateLearningStatus();
            }

            // 继续下一个节点
            if (state.learning.isRunning) {
                setTimeout(() => {
                    goToNextNode();
                }, 1000);
            }
            return;
        }
    }

    const mediaElements: HTMLMediaElement[] = [
        ...Array.from(document.querySelectorAll('audio')),
        ...Array.from(document.querySelectorAll('video'))
    ];

    if (mediaElements.length === 0) {
        // 没有媒体元素，检查是否是文档
        updateLearningProgressText('检测到文档，准备浏览...');
        Logger.info('检测到文档类型内容');
        state.learning.isDocument = true;
        setTimeout(() => {
            handleDocument();
        }, 1000);
        return;
    }

    // 有媒体元素，播放媒体
    state.learning.isDocument = false;
    const mediaType = mediaElements[0].tagName.toLowerCase() === 'video' ? '视频' : '音频';
    Logger.info(`检测到${mediaType}内容，开始播放`);
    playMedia(mediaElements);
}

/**
 * 安全地点击元素
 */
function safeClick(element: HTMLElement): boolean {
    try {
        // 方法1: 创建并分发点击事件
        const clickEvent = new MouseEvent('click', {
            bubbles: true,
            cancelable: true,
            view: window
        });
        element.dispatchEvent(clickEvent);
        return true;
    } catch {
        try {
            // 方法2: 直接调用 click
            element.click();
            return true;
        } catch {
            return false;
        }
    }
}

/**
 * 点击节点
 */
export async function clickNode(nodeInfo: LearningNode): Promise<void> {
    state.learning.currentNode = nodeInfo;
    updateLearningStatus();

    // 重置进度条并更新文本
    Utils.resetProgressBar('learning-progress-bar');
    updateLearningProgressText('正在加载内容...');

    const shortTitle = nodeInfo.title.length > 25 ? nodeInfo.title.substring(0, 25) + '...' : nodeInfo.title;
    Logger.info(`开始学习: ${shortTitle}`);

    // 优先通过 ID 获取最新的元素引用
    let targetElement: HTMLElement | null = null;

    if (nodeInfo.id) {
        targetElement = document.getElementById(nodeInfo.id);
    }

    // 如果通过 ID 找不到，尝试使用缓存的元素
    if (!targetElement && nodeInfo.element) {
        try {
            if (nodeInfo.element.isConnected) {
                targetElement = nodeInfo.element;
            }
        } catch {
            // 元素可能已失效
        }
    }

    if (targetElement) {
        if (safeClick(targetElement)) {
            // 检测内容类型
            setTimeout(() => {
                detectContentType();
            }, 3000);
            return;
        }
    }

    // 找不到有效元素，重新扫描
    Logger.warn('无法点击节点，重新扫描');
    scanLearningNodes();
    setTimeout(() => {
        goToNextNode();
    }, 1000);
}

/**
 * 进入下一个未完成节点
 */
export async function goToNextNode(): Promise<void> {
    // 重新扫描以获取最新状态
    scanLearningNodes();

    // 找到未完成的节点
    const uncompletedNodes = state.learning.allNodes.filter(n => !n.isCompleted);

    if (uncompletedNodes.length === 0) {
        // 当前可见节点都完成了，尝试展开下一个章节
        updateLearningProgressText('🎯 当前章节已完成，正在查找下一章节...');

        const foundNewSection = await expandNextUncompletedSection();

        if (foundNewSection) {
            // 找到了新章节，重新扫描并继续
            scanLearningNodes();

            // 再次检查是否有未完成的节点
            const newUncompletedNodes = state.learning.allNodes.filter(n => !n.isCompleted);
            if (newUncompletedNodes.length > 0) {
                const nextNode = newUncompletedNodes[0];

                // 如果是考试节点，跳过
                if (nextNode.isExam) {
                    updateLearningProgressText(`⏭️ 跳过考试节点：${nextNode.title.substring(0, 20)}...`);
                    state.learning.processedNodes.add(nextNode.id);
                    saveLearningProgress();
                    updateLearningStatus();
                    setTimeout(() => {
                        goToNextNode();
                    }, 500);
                    return;
                }

                setTimeout(() => {
                    clickNode(nextNode);
                }, 1000);
            } else {
                // 还是没有未完成的节点，递归继续查找
                setTimeout(() => {
                    goToNextNode();
                }, 1000);
            }
        } else {
            // 没有找到新章节，真的完成了
            updateLearningProgressText('🎉 所有章节已完成！');
            Logger.success('所有学习内容已完成！');
            state.learning.isRunning = false;
            const startBtn = document.getElementById('learning-start') as HTMLButtonElement | null;
            if (startBtn) startBtn.disabled = false;
            const statusEl = document.getElementById('learning-status');
            if (statusEl) statusEl.textContent = '已完成';
            const statusDot = document.getElementById('learning-status-dot');
            if (statusDot) {
                statusDot.classList.remove('running');
                statusDot.classList.add('completed');
            }
        }
        return;
    }

    // 找到第一个未完成的节点
    const nextNode = uncompletedNodes[0];

    // 如果是考试节点，标记为已处理并跳过
    if (nextNode.isExam) {
        updateLearningProgressText(`⏭️ 跳过考试节点：${nextNode.title.substring(0, 20)}...`);

        state.learning.processedNodes.add(nextNode.id);
        saveLearningProgress();
        updateLearningStatus();

        setTimeout(() => {
            goToNextNode();
        }, 500);
        return;
    }

    // 不是考试节点，正常学习
    setTimeout(() => {
        clickNode(nextNode);
    }, 1000);
}

/**
 * 开始学习
 */
export function startLearning(): void {
    if (state.learning.isRunning) return;

    state.learning.isRunning = true;
    const startBtn = document.getElementById('learning-start') as HTMLButtonElement | null;
    if (startBtn) startBtn.disabled = true;
    const statusEl = document.getElementById('learning-status');
    if (statusEl) statusEl.textContent = '运行中';
    const statusDot = document.getElementById('learning-status-dot');
    if (statusDot) statusDot.classList.add('running');

    // 隐藏"继续播放"提示框（只执行一次）
    setTimeout(() => {
        hideContinuePlayDialog();
    }, 500);

    Logger.info('开始自动学习');
    scanLearningNodes();

    // 开始第一个未完成的节点
    setTimeout(() => {
        goToNextNode();
    }, 1000);
}
