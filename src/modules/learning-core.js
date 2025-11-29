import { state, saveLearningProgress } from '../utils/state.js';
import { Logger } from '../utils/logger.js';
import { Utils } from '../utils/index.js';
import { CONFIG } from '../ui/config-instance.js';

/**
 * 学习模块 - 完整功能
 */

/**
 * 检查节点是否是考试/测验类型
 */
export function isExamNode(nodeElement) {
    const examButton = nodeElement.querySelector('.li_action .btn_dt');
    if (examButton) {
        const btnText = examButton.textContent.trim();
        if (btnText.includes('开始答题') || btnText.includes('答题') || btnText.includes('考试') || btnText.includes('测验')) {
            return true;
        }
    }
    return false;
}

/**
 * 扫描学习节点
 */
export function scanLearningNodes() {
    const nodes = document.querySelectorAll('.panelList .node');
    state.learning.allNodes = [];
    state.learning.completedCount = 0;
    state.learning.examCount = 0;
    state.learning.totalCount = nodes.length;

    nodes.forEach((node, index) => {
        const titleElement = node.querySelector('.title');
        const statusIcon = node.querySelector('.jd');
        const title = titleElement ? titleElement.textContent.trim() : `节点${index + 1}`;
        const id = node.id;
        const isCompleted = (statusIcon && statusIcon.classList.contains('wc')) || state.learning.processedNodes.has(id);

        const isExam = isExamNode(node);
        if (isExam) {
            state.learning.examCount++;
        }

        state.learning.allNodes.push({
            element: node,
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
export function updateLearningStatus() {
    const progressText = `${state.learning.completedCount}/${state.learning.totalCount}`;
    const progressElement = document.getElementById('learning-progress');

    if (progressElement) {
        if (state.learning.examCount > 0) {
            progressElement.textContent = progressText;
            progressElement.title = `跳过 ${state.learning.examCount} 个考试/测验节点`;
        } else {
            progressElement.textContent = progressText;
            progressElement.title = '';
        }
    }

    document.getElementById('learning-processed').textContent =
        state.learning.processedNodes.size;

    if (state.learning.currentNode && state.learning.currentNode.title) {
        const shortTitle = state.learning.currentNode.title.length > 18
            ? state.learning.currentNode.title.substring(0, 18) + '...'
            : state.learning.currentNode.title;
        document.getElementById('learning-current').textContent = shortTitle;
        document.getElementById('learning-current').title = state.learning.currentNode.title;
    } else {
        document.getElementById('learning-current').textContent = '无';
        document.getElementById('learning-current').title = '';
    }
}

/**
 * 应用播放倍速
 */
export function applyPlaybackRate() {
    const mediaElements = [
        ...document.querySelectorAll('audio'),
        ...document.querySelectorAll('video')
    ];
    mediaElements.forEach(media => {
        media.playbackRate = CONFIG.learning.playbackRate;
    });
}

/**
 * 应用静音设置
 */
export function applyMuteToCurrentMedia() {
    const mediaElements = [
        ...document.querySelectorAll('audio'),
        ...document.querySelectorAll('video')
    ];
    mediaElements.forEach(media => {
        media.muted = CONFIG.learning.muteMedia;
    });
}

/**
 * 重置学习进度
 */
export function resetLearning() {
    if (confirm('确定要清空所有已处理节点的记录吗？')) {
        state.learning.processedNodes.clear();
        if (state.learning.completedChapters) {
            state.learning.completedChapters.clear();
        }
        saveLearningProgress();
        scanLearningNodes();
        Logger.warn('已重置所有学习进度');
    }
}

/**
 * 更新学习进度文本
 */
export function updateLearningProgressText(text) {
    const progressText = document.getElementById('learning-progress-text');
    if (progressText) {
        progressText.textContent = text;
    }
}

/**
 * 通过API获取章节内容
 */
export async function fetchChapterContentByAPI(chapterId) {
    try {
        const urlParams = new URLSearchParams(window.location.search);
        const courseInfoId = urlParams.get('courseInfoId');
        const courseId = urlParams.get('courseId');

        if (!courseInfoId || !courseId) {
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
            return null;
        }

        const data = await response.json();
        return data;

    } catch (error) {
        return null;
    }
}

/**
 * 查找并展开下一个未完成的章节
 */
export async function expandNextUncompletedSection() {
    updateLearningProgressText('🔍 正在查找下一个章节...');

    const sections = document.querySelectorAll('.one > .draggablebox > span > .collapse-panel');

    for (let section of sections) {
        const panelTitle = section.querySelector('.panel-title');
        const panelContent = section.querySelector('.panel-content');

        if (!panelTitle || !panelContent) continue;

        // 如果章节是展开的，检查是否所有子节点都完成了
        if (panelContent.style.display !== 'none') {
            const nodes = section.querySelectorAll('.panelList .node');

            if (nodes.length > 0) {
                const allCompleted = Array.from(nodes).every(node => {
                    const statusIcon = node.querySelector('.jd');
                    const id = node.id;
                    const isExam = isExamNode(node);
                    return (statusIcon && statusIcon.classList.contains('wc')) || state.learning.processedNodes.has(id) || isExam;
                });

                if (allCompleted) {
                    const chapterId = section.id;

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
            const chapterId = section.id;

            if (state.learning.completedChapters && state.learning.completedChapters.has(chapterId)) {
                continue;
            }

            const titleText = panelTitle.textContent.trim().substring(0, 40);
            updateLearningProgressText(`📂 正在展开新章节：${titleText}...`);

            // 方法1: 先通过API获取内容
            await fetchChapterContentByAPI(chapterId);
            await Utils.sleep(500);

            // 方法2: 点击箭头图标展开
            const arrow = panelTitle.querySelector('.jiantou');
            if (arrow) {
                arrow.click();
                await Utils.sleep(800);
            }

            // 等待DOM更新
            await Utils.sleep(2000);

            // 多次检查节点是否出现
            let nodes = section.querySelectorAll('.panelList .node');
            let retryCount = 0;
            const maxRetries = 5;

            while (nodes.length === 0 && retryCount < maxRetries) {
                await Utils.sleep(1500);
                nodes = section.querySelectorAll('.panelList .node');
                retryCount++;

                if (nodes.length === 0 && retryCount === 2) {
                    const arrow = panelTitle.querySelector('.jiantou');
                    if (arrow) {
                        arrow.click();
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
export function getDocumentPageInfo() {
    const pageDiv = document.querySelector('.page');
    if (!pageDiv) return null;

    const match = pageDiv.textContent.match(/(\d+)\s*\/\s*(\d+)/);
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
export function clickNextPage() {
    const buttons = document.querySelectorAll('.page button');
    for (let btn of buttons) {
        const span = btn.querySelector('span');
        if (span && span.textContent.includes('下一页')) {
            btn.click();
            return true;
        }
    }
    return false;
}

/**
 * 处理文档类型内容
 */
export function handleDocument() {
    const pageInfo = getDocumentPageInfo();

    if (pageInfo) {
        state.learning.currentPage = pageInfo.current;
        state.learning.totalPages = pageInfo.total;

        // 更新进度条
        const percentage = (pageInfo.current / pageInfo.total) * 100;
        const progressBar = document.getElementById('learning-progress-bar');
        if (progressBar) {
            progressBar.style.width = `${percentage}%`;
            progressBar.setAttribute('data-progress', `${Math.round(percentage)}%`);
        }

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
                const progressBar = document.getElementById('learning-progress-bar');
                if (progressBar) {
                    progressBar.style.width = '0%';
                }
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
function hideContinuePlayDialog() {
    const dialogs = document.querySelectorAll('[role="dialog"]');
    for (let dialog of dialogs) {
        const titleSpan = dialog.querySelector('.el-message-box__title span');
        if (titleSpan && titleSpan.textContent.includes('提示')) {
            const messageDiv = dialog.querySelector('.el-message-box__message p');
            if (messageDiv && messageDiv.textContent.includes('是否继续')) {
                dialog.style.display = 'none';
                Logger.info('已隐藏"继续播放"提示框');
                return true;
            }
        }
    }
    return false;
}

/**
 * 播放媒体
 */
export function playMedia(mediaElements) {
    mediaElements.forEach((media, index) => {
        if (media.dataset.processed) return;
        media.dataset.processed = 'true';

        const mediaType = media.tagName.toLowerCase() === 'video' ? '视频' : '音频';

        // 设置播放倍速
        media.playbackRate = CONFIG.learning.playbackRate;

        // 设置静音
        media.muted = CONFIG.learning.muteMedia;

        // 更新进度文本
        updateLearningProgressText(`${mediaType}播放中...`);

        // 监听播放进度
        media.addEventListener('timeupdate', () => {
            if (media.duration > 0) {
                const current = media.currentTime;
                const total = media.duration;
                const percentage = (current / total) * 100;

                // 更新进度条
                const progressBar = document.getElementById('learning-progress-bar');
                if (progressBar) {
                    progressBar.style.width = `${percentage}%`;
                    progressBar.setAttribute('data-progress', `${Math.round(percentage)}%`);
                }

                // 更新进度文本
                updateLearningProgressText(`${mediaType}: ${Utils.formatTime(current)} / ${Utils.formatTime(total)}`);
            }
        });

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
            const progressBar = document.getElementById('learning-progress-bar');
            if (progressBar) {
                progressBar.style.width = '0%';
            }
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
export function detectContentType() {
    // 首先检查是否是考试/测验页面
    const examButton = document.querySelector('.li_action .btn_dt, .btn_dt');
    if (examButton) {
        const btnText = examButton.textContent.trim();
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

    const mediaElements = [
        ...document.querySelectorAll('audio'),
        ...document.querySelectorAll('video')
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
 * 点击节点
 */
export async function clickNode(nodeInfo) {
    state.learning.currentNode = nodeInfo;
    updateLearningStatus();

    // 重置进度条并更新文本
    const progressBar = document.getElementById('learning-progress-bar');
    if (progressBar) {
        progressBar.style.width = '0%';
    }
    updateLearningProgressText('正在加载内容...');

    const shortTitle = nodeInfo.title.length > 25 ? nodeInfo.title.substring(0, 25) + '...' : nodeInfo.title;
    Logger.info(`开始学习: ${shortTitle}`);

    if (nodeInfo.element) {
        nodeInfo.element.click();

        // 检测内容类型
        setTimeout(() => {
            detectContentType();
        }, 3000);
    }
}

/**
 * 进入下一个未完成节点
 */
export async function goToNextNode() {
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
            document.getElementById('learning-start').disabled = false;
            document.getElementById('learning-status').textContent = '已完成';
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
export function startLearning() {
    if (state.learning.isRunning) return;

    state.learning.isRunning = true;
    document.getElementById('learning-start').disabled = true;
    document.getElementById('learning-status').textContent = '运行中';
    const statusDot = document.getElementById('learning-status-dot');
    if (statusDot) statusDot.classList.add('running');

    // 隐藏"继续播放"提示框
    hideContinuePlayDialog();
    // 使用 MutationObserver 持续监听并隐藏提示框
    const observer = new MutationObserver(() => {
        hideContinuePlayDialog();
    });
    observer.observe(document.body, {
        childList: true,
        subtree: true
    });
    state.learning.dialogObserver = observer;

    Logger.info('开始自动学习');
    scanLearningNodes();

    // 开始第一个未完成的节点
    setTimeout(() => {
        goToNextNode();
    }, 1000);
}
