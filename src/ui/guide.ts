/**
 * 新手引导模块
 */

const GUIDE_STORAGE_KEY = 'icve_guide_completed';
const GUIDE_VERSION = '1.0'; // 版本变更时会重新显示引导

interface GuideStep {
    title: string;
    content: string;
    target?: string; // 可选的目标元素选择器
}

const guideSteps: GuideStep[] = [
    {
        title: '👋 欢迎使用智慧职教全能助手',
        content: '本助手可以帮助您自动学习课程和智能答题。让我们快速了解一下主要功能！'
    },
    {
        title: '📚 自动学习功能',
        content: '在学习页面，点击"开始学习"即可自动播放视频、浏览文档。播放倍速、完成等待和静音模式可在"配置"中调整。',
        target: '[data-task-panel="learning"]'
    },
    {
        title: '🤖 AI智能答题',
        content: '在答题页面，先到"配置"里设置服务、模型和 API Key，再点击"开始答题"即可自动答题。',
        target: '[data-task-panel="exam"]'
    },
    {
        title: '📋 日志查看',
        content: '学习和答题页面下方会显示最近操作，方便快速确认执行状态。',
        target: '.recent-events'
    },
    {
        title: '⚙️ 小技巧',
        content: '• 拖动标题栏或折叠入口可移动面板\n• 学习、答题和配置是同级标签\n• 所有配置会自动保存\n• 面板位置和折叠状态也会记住'
    },
    {
        title: '✅ 开始使用',
        content: '现在您已经了解了基本功能，开始您的学习之旅吧！如有问题请查看GitHub项目页面。'
    }
];

/**
 * 检查是否需要显示引导
 */
export function shouldShowGuide(): boolean {
    try {
        const stored = localStorage.getItem(GUIDE_STORAGE_KEY);
        if (!stored) return true;

        const data = JSON.parse(stored);
        return data.version !== GUIDE_VERSION;
    } catch {
        return true;
    }
}

/**
 * 标记引导已完成
 */
export function markGuideCompleted(): void {
    localStorage.setItem(GUIDE_STORAGE_KEY, JSON.stringify({
        version: GUIDE_VERSION,
        completedAt: Date.now()
    }));
}

/**
 * 重置引导状态（用于重新显示引导）
 */
export function resetGuide(): void {
    localStorage.removeItem(GUIDE_STORAGE_KEY);
}

/**
 * 创建引导模态框
 */
export function createGuideModal(): HTMLElement {
    const modal = document.createElement('div');
    modal.id = 'icve-guide-modal';
    const panel = document.getElementById('icve-tabbed-panel');
    modal.className = panel?.classList.contains('dark-theme') ? 'guide-modal dark-theme' : 'guide-modal';
    modal.innerHTML = `
        <div class="guide-overlay"></div>
        <div class="guide-content">
            <div class="guide-header">
                <span class="guide-step-indicator">1 / ${guideSteps.length}</span>
                <button class="guide-close" title="跳过引导">✕</button>
            </div>
            <div class="guide-body">
                <h3 class="guide-title">${guideSteps[0].title}</h3>
                <p class="guide-text">${guideSteps[0].content.replace(/\n/g, '<br>')}</p>
            </div>
            <div class="guide-footer">
                <button class="btn btn-outline guide-prev" disabled>上一步</button>
                <div class="guide-dots">
                    ${guideSteps.map((_, i) => `<span class="guide-dot${i === 0 ? ' active' : ''}" data-step="${i}"></span>`).join('')}
                </div>
                <button class="btn btn-primary guide-next">下一步</button>
            </div>
        </div>
    `;
    return modal;
}

/**
 * 显示新手引导
 */
export function showGuide(): void {
    if (!shouldShowGuide()) return;

    const modal = createGuideModal();
    document.body.appendChild(modal);

    let currentStep = 0;

    const updateStep = (step: number): void => {
        currentStep = step;
        const stepData = guideSteps[step];

        // 更新内容
        const title = modal.querySelector('.guide-title');
        const text = modal.querySelector('.guide-text');
        const indicator = modal.querySelector('.guide-step-indicator');
        const prevBtn = modal.querySelector('.guide-prev') as HTMLButtonElement;
        const nextBtn = modal.querySelector('.guide-next') as HTMLButtonElement;
        const dots = modal.querySelectorAll('.guide-dot');

        if (title) title.textContent = stepData.title;
        if (text) text.innerHTML = stepData.content.replace(/\n/g, '<br>');
        if (indicator) indicator.textContent = `${step + 1} / ${guideSteps.length}`;

        // 更新按钮状态
        if (prevBtn) prevBtn.disabled = step === 0;
        if (nextBtn) {
            nextBtn.textContent = step === guideSteps.length - 1 ? '完成' : '下一步';
        }

        // 更新点指示器
        dots.forEach((dot, i) => {
            dot.classList.toggle('active', i === step);
        });

        // 高亮目标元素（如果有）
        highlightTarget(stepData.target);
    };

    const highlightTarget = (selector?: string): void => {
        // 移除之前的高亮
        document.querySelectorAll('.guide-highlight').forEach(el => {
            el.classList.remove('guide-highlight');
        });

        if (selector) {
            const target = document.querySelector(selector);
            if (target) {
                target.classList.add('guide-highlight');
                // 如果是标签页，切换到该标签页
                if (selector.startsWith('#tab-')) {
                    const tabName = selector.replace('#tab-', '');
                    const tabBtn = document.querySelector(`[data-tab="${tabName}"]`) as HTMLElement;
                    if (tabBtn) tabBtn.click();
                }
            }
        }
    };

    const closeGuide = (): void => {
        document.querySelectorAll('.guide-highlight').forEach(el => {
            el.classList.remove('guide-highlight');
        });
        modal.remove();
        markGuideCompleted();
    };

    // 事件绑定
    modal.querySelector('.guide-close')?.addEventListener('click', closeGuide);
    modal.querySelector('.guide-overlay')?.addEventListener('click', closeGuide);

    modal.querySelector('.guide-prev')?.addEventListener('click', () => {
        if (currentStep > 0) updateStep(currentStep - 1);
    });

    modal.querySelector('.guide-next')?.addEventListener('click', () => {
        if (currentStep < guideSteps.length - 1) {
            updateStep(currentStep + 1);
        } else {
            closeGuide();
        }
    });

    // 点击点指示器跳转
    modal.querySelectorAll('.guide-dot').forEach(dot => {
        dot.addEventListener('click', (e) => {
            const step = parseInt((e.target as HTMLElement).dataset.step || '0');
            updateStep(step);
        });
    });

    // 键盘导航
    const handleKeydown = (e: KeyboardEvent): void => {
        if (e.key === 'Escape') {
            closeGuide();
        } else if (e.key === 'ArrowRight' || e.key === 'Enter') {
            if (currentStep < guideSteps.length - 1) {
                updateStep(currentStep + 1);
            } else {
                closeGuide();
            }
        } else if (e.key === 'ArrowLeft') {
            if (currentStep > 0) updateStep(currentStep - 1);
        }
    };

    document.addEventListener('keydown', handleKeydown);

    // 清理事件监听
    const observer = new MutationObserver((mutations) => {
        mutations.forEach((mutation) => {
            mutation.removedNodes.forEach((node) => {
                if (node === modal) {
                    document.removeEventListener('keydown', handleKeydown);
                    observer.disconnect();
                }
            });
        });
    });
    observer.observe(document.body, { childList: true });
}

/**
 * 获取引导样式
 */
export function getGuideStyles(): string {
    return `
        /* 引导模态框 */
        .guide-modal {
            --guide-bg: #ffffff;
            --guide-bg-subtle: #f7f9fc;
            --guide-bg-hover: #eaf2fb;
            --guide-border: #dbe5f0;
            --guide-border-strong: #bfd0e3;
            --guide-text: #1f2a3d;
            --guide-text-muted: #66758a;
            --guide-primary: #3b82f6;
            --guide-primary-hover: #2563eb;
            --guide-primary-soft: #dbeafe;
            position: fixed;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            z-index: 100001;
            display: flex;
            align-items: center;
            justify-content: center;
        }

        .guide-overlay {
            position: absolute;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            background: rgba(31, 42, 61, 0.18);
            backdrop-filter: none;
        }

        .guide-content {
            position: relative;
            background: var(--guide-bg);
            border: 1px solid var(--guide-border);
            border-radius: 14px;
            box-shadow: 0 18px 42px rgba(31, 42, 61, 0.16);
            width: 90%;
            max-width: 460px;
            overflow: hidden;
            animation: guideSlideIn 0.3s ease;
        }

        @keyframes guideSlideIn {
            from {
                opacity: 0;
                transform: translateY(-20px) scale(0.95);
            }
            to {
                opacity: 1;
                transform: translateY(0) scale(1);
            }
        }

        .guide-header {
            display: flex;
            justify-content: space-between;
            align-items: center;
            padding: 12px 16px;
            background: var(--guide-bg);
            color: var(--guide-text);
            border-bottom: 1px solid var(--guide-border);
        }

        .guide-step-indicator {
            font-size: 13px;
            color: var(--guide-text-muted);
            opacity: 1;
        }

        .guide-close {
            width: 32px;
            height: 32px;
            background: var(--guide-bg-subtle);
            border: 1px solid var(--guide-border);
            border-radius: 9px;
            color: var(--guide-text-muted);
            font-size: 14px;
            cursor: pointer;
            opacity: 1;
            transition: background 0.18s ease, border-color 0.18s ease, color 0.18s ease;
            padding: 0;
        }

        .guide-close:hover {
            background: var(--guide-bg-hover);
            border-color: var(--guide-border-strong);
            color: var(--guide-text);
        }

        .guide-body {
            padding: 24px;
        }

        .guide-title {
            margin: 0 0 12px 0;
            font-size: 18px;
            color: var(--guide-text);
        }

        .guide-text {
            margin: 0;
            font-size: 14px;
            color: var(--guide-text-muted);
            line-height: 1.6;
        }

        .guide-footer {
            display: flex;
            justify-content: space-between;
            align-items: center;
            gap: 12px;
            padding: 16px 24px;
            background: var(--guide-bg-subtle);
            border-top: 1px solid var(--guide-border);
        }

        .guide-footer .btn {
            min-width: 86px;
            height: 38px;
            padding: 0 14px;
            border-radius: 10px;
            font-size: 13px;
            font-weight: 700;
            box-shadow: none;
        }

        .guide-footer .guide-prev {
            background: var(--guide-bg) !important;
            border: 1px solid var(--guide-border) !important;
            color: var(--guide-text-muted) !important;
        }

        .guide-footer .guide-prev:not(:disabled):hover {
            background: var(--guide-bg-hover) !important;
            border-color: var(--guide-border-strong) !important;
            color: var(--guide-text) !important;
        }

        .guide-footer .guide-prev:disabled {
            background: #f2f6fb !important;
            border-color: #e3ebf5 !important;
            color: #a6b3c4 !important;
            opacity: 1;
            cursor: not-allowed;
        }

        .guide-footer .guide-next {
            background: var(--guide-primary) !important;
            border: 1px solid var(--guide-primary) !important;
            color: white !important;
        }

        .guide-footer .guide-next:hover {
            background: var(--guide-primary-hover) !important;
            border-color: var(--guide-primary-hover) !important;
            filter: none;
        }

        .guide-dots {
            display: flex;
            gap: 8px;
        }

        .guide-dot {
            width: 8px;
            height: 8px;
            border-radius: 50%;
            background: var(--guide-border-strong);
            cursor: pointer;
            transition: all 0.2s;
        }

        .guide-dot:hover {
            background: var(--guide-text-subtle, #9aa8ba);
        }

        .guide-dot.active {
            background: var(--guide-primary);
            transform: scale(1.2);
        }

        /* 高亮目标元素 */
        .guide-highlight {
            position: relative;
            z-index: 100000;
            box-shadow: 0 0 0 4px rgba(59, 130, 246, 0.18), 0 12px 30px rgba(31, 42, 61, 0.14);
            border-radius: 8px;
        }

        /* 深色主题适配 */
        .guide-modal.dark-theme {
            --guide-bg: #111827;
            --guide-bg-subtle: #182235;
            --guide-bg-hover: #223047;
            --guide-border: #2c3a51;
            --guide-border-strong: #3e4f68;
            --guide-text: #e7eef9;
            --guide-text-muted: #a8b4c7;
            --guide-primary: #60a5fa;
            --guide-primary-hover: #93c5fd;
            --guide-primary-soft: rgba(96, 165, 250, 0.16);
        }

        .dark-theme .guide-content {
            background: var(--guide-bg);
        }

        .dark-theme .guide-title {
            color: var(--guide-text);
        }

        .dark-theme .guide-text {
            color: var(--guide-text-muted);
        }

        .dark-theme .guide-footer {
            background: var(--guide-bg-subtle);
            border-top-color: var(--guide-border);
        }

        .dark-theme .guide-footer .guide-prev {
            background: var(--guide-bg) !important;
            border-color: var(--guide-border) !important;
            color: var(--guide-text-muted) !important;
        }

        .dark-theme .guide-footer .guide-prev:disabled {
            background: #111827 !important;
            border-color: #1f2937 !important;
            color: #64748b !important;
        }

        .dark-theme .guide-dot {
            background: var(--guide-border-strong);
        }

        .dark-theme .guide-dot.active {
            background: var(--guide-primary);
        }
    `;
}
