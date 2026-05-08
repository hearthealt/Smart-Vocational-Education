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
        content: '在学习页面，点击"开始学习"按钮即可自动播放视频、浏览文档。支持调整播放倍速（最高16倍速）和静音模式。',
        target: '#tab-learning'
    },
    {
        title: '🤖 AI智能答题',
        content: '在答题页面，配置您的AI API密钥后，点击"开始"即可自动答题。支持 OpenAI 和兼容 OpenAI 接口的自定义服务。',
        target: '#tab-exam'
    },
    {
        title: '📋 日志查看',
        content: '日志面板会记录所有操作，支持按类型筛选、搜索和导出，方便追踪学习和答题进度。',
        target: '#tab-log'
    },
    {
        title: '⚙️ 小技巧',
        content: '• 拖动标题栏可移动面板位置\n• 点击右上角按钮可切换深色主题\n• 所有配置会自动保存\n• 面板位置和折叠状态也会记住'
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
    modal.className = 'guide-modal';
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
            background: rgba(0, 0, 0, 0.6);
            backdrop-filter: blur(2px);
        }

        .guide-content {
            position: relative;
            background: white;
            border-radius: 12px;
            box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
            width: 90%;
            max-width: 420px;
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
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: white;
        }

        .guide-step-indicator {
            font-size: 13px;
            opacity: 0.9;
        }

        .guide-close {
            background: none;
            border: none;
            color: white;
            font-size: 18px;
            cursor: pointer;
            opacity: 0.8;
            transition: opacity 0.2s;
            padding: 4px 8px;
        }

        .guide-close:hover {
            opacity: 1;
        }

        .guide-body {
            padding: 24px;
        }

        .guide-title {
            margin: 0 0 12px 0;
            font-size: 18px;
            color: #1f2937;
        }

        .guide-text {
            margin: 0;
            font-size: 14px;
            color: #4b5563;
            line-height: 1.6;
        }

        .guide-footer {
            display: flex;
            justify-content: space-between;
            align-items: center;
            padding: 16px 24px;
            background: #f9fafb;
            border-top: 1px solid #e5e7eb;
        }

        .guide-dots {
            display: flex;
            gap: 8px;
        }

        .guide-dot {
            width: 8px;
            height: 8px;
            border-radius: 50%;
            background: #d1d5db;
            cursor: pointer;
            transition: all 0.2s;
        }

        .guide-dot:hover {
            background: #9ca3af;
        }

        .guide-dot.active {
            background: #667eea;
            transform: scale(1.2);
        }

        .guide-prev:disabled {
            opacity: 0.5;
            cursor: not-allowed;
        }

        /* 高亮目标元素 */
        .guide-highlight {
            position: relative;
            z-index: 100000;
            box-shadow: 0 0 0 4px rgba(102, 126, 234, 0.5), 0 0 20px rgba(102, 126, 234, 0.3);
            border-radius: 8px;
        }

        /* 深色主题适配 */
        .dark-theme .guide-content {
            background: #1e293b;
        }

        .dark-theme .guide-title {
            color: #f1f5f9;
        }

        .dark-theme .guide-text {
            color: #94a3b8;
        }

        .dark-theme .guide-footer {
            background: #0f172a;
            border-top-color: #334155;
        }

        .dark-theme .guide-dot {
            background: #475569;
        }

        .dark-theme .guide-dot.active {
            background: #818cf8;
        }
    `;
}
