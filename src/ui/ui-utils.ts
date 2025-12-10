/**
 * UI 工具模块 - 按钮加载状态、确认对话框等
 */

/**
 * 设置按钮加载状态
 */
export function setButtonLoading(button: HTMLButtonElement, loading: boolean, loadingText?: string): void {
    if (loading) {
        button.dataset.originalText = button.textContent || '';
        button.disabled = true;
        button.classList.add('btn-loading');
        if (loadingText) {
            button.textContent = loadingText;
        } else {
            button.innerHTML = '<span class="btn-spinner"></span> 处理中...';
        }
    } else {
        button.disabled = false;
        button.classList.remove('btn-loading');
        button.textContent = button.dataset.originalText || '';
        delete button.dataset.originalText;
    }
}

/**
 * 显示确认对话框
 */
export function showConfirmDialog(options: {
    title: string;
    message: string;
    confirmText?: string;
    cancelText?: string;
    danger?: boolean;
}): Promise<boolean> {
    return new Promise((resolve) => {
        const dialog = document.createElement('div');
        dialog.className = 'confirm-dialog-overlay';
        dialog.innerHTML = `
            <div class="confirm-dialog">
                <div class="confirm-dialog-header">
                    <h4 class="confirm-dialog-title">${options.title}</h4>
                </div>
                <div class="confirm-dialog-body">
                    <p class="confirm-dialog-message">${options.message}</p>
                </div>
                <div class="confirm-dialog-footer">
                    <button class="btn btn-outline confirm-dialog-cancel">${options.cancelText || '取消'}</button>
                    <button class="btn ${options.danger ? 'btn-danger' : 'btn-primary'} confirm-dialog-confirm">
                        ${options.confirmText || '确认'}
                    </button>
                </div>
            </div>
        `;

        const close = (result: boolean): void => {
            dialog.classList.add('closing');
            setTimeout(() => {
                dialog.remove();
                resolve(result);
            }, 200);
        };

        dialog.querySelector('.confirm-dialog-cancel')?.addEventListener('click', () => close(false));
        dialog.querySelector('.confirm-dialog-confirm')?.addEventListener('click', () => close(true));
        dialog.addEventListener('click', (e) => {
            if (e.target === dialog) close(false);
        });

        // ESC 键关闭
        const handleEsc = (e: KeyboardEvent): void => {
            if (e.key === 'Escape') {
                close(false);
                document.removeEventListener('keydown', handleEsc);
            }
        };
        document.addEventListener('keydown', handleEsc);

        document.body.appendChild(dialog);
        requestAnimationFrame(() => dialog.classList.add('visible'));
    });
}

/**
 * 显示提示消息
 */
export function showToast(message: string, type: 'success' | 'error' | 'info' | 'warning' = 'info', duration: number = 3000): void {
    const toast = document.createElement('div');
    toast.className = `toast toast-${type}`;

    const icons: Record<string, string> = {
        success: '✅',
        error: '❌',
        info: 'ℹ️',
        warning: '⚠️'
    };

    toast.innerHTML = `
        <span class="toast-icon">${icons[type]}</span>
        <span class="toast-message">${message}</span>
    `;

    // 找到或创建 toast 容器
    let container = document.getElementById('toast-container');
    if (!container) {
        container = document.createElement('div');
        container.id = 'toast-container';
        document.body.appendChild(container);
    }

    container.appendChild(toast);
    requestAnimationFrame(() => toast.classList.add('visible'));

    setTimeout(() => {
        toast.classList.remove('visible');
        setTimeout(() => toast.remove(), 300);
    }, duration);
}

/**
 * 获取 UI 工具样式
 */
export function getUIUtilsStyles(): string {
    return `
        /* 按钮加载状态 */
        .btn-loading {
            position: relative;
            pointer-events: none;
        }

        .btn-spinner {
            display: inline-block;
            width: 12px;
            height: 12px;
            border: 2px solid currentColor;
            border-right-color: transparent;
            border-radius: 50%;
            animation: btnSpin 0.6s linear infinite;
            vertical-align: middle;
            margin-right: 4px;
        }

        @keyframes btnSpin {
            to { transform: rotate(360deg); }
        }

        /* 确认对话框 */
        .confirm-dialog-overlay {
            position: fixed;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            background: rgba(0, 0, 0, 0.5);
            display: flex;
            align-items: center;
            justify-content: center;
            z-index: 100002;
            opacity: 0;
            transition: opacity 0.2s;
        }

        .confirm-dialog-overlay.visible {
            opacity: 1;
        }

        .confirm-dialog-overlay.closing {
            opacity: 0;
        }

        .confirm-dialog {
            background: white;
            border-radius: 8px;
            box-shadow: 0 10px 40px rgba(0, 0, 0, 0.2);
            width: 90%;
            max-width: 360px;
            transform: scale(0.95);
            transition: transform 0.2s;
        }

        .confirm-dialog-overlay.visible .confirm-dialog {
            transform: scale(1);
        }

        .confirm-dialog-header {
            padding: 16px;
            border-bottom: 1px solid #e5e7eb;
        }

        .confirm-dialog-title {
            margin: 0;
            font-size: 16px;
            font-weight: 600;
            color: #1f2937;
        }

        .confirm-dialog-body {
            padding: 16px;
        }

        .confirm-dialog-message {
            margin: 0;
            font-size: 14px;
            color: #4b5563;
            line-height: 1.5;
        }

        .confirm-dialog-footer {
            padding: 12px 16px;
            background: #f9fafb;
            border-top: 1px solid #e5e7eb;
            border-radius: 0 0 8px 8px;
            display: flex;
            justify-content: flex-end;
            gap: 8px;
        }

        /* Toast 提示 */
        #toast-container {
            position: fixed;
            top: 20px;
            left: 50%;
            transform: translateX(-50%);
            z-index: 100003;
            display: flex;
            flex-direction: column;
            gap: 8px;
            pointer-events: none;
        }

        .toast {
            background: white;
            padding: 10px 16px;
            border-radius: 8px;
            box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
            display: flex;
            align-items: center;
            gap: 8px;
            opacity: 0;
            transform: translateY(-10px);
            transition: all 0.3s ease;
            pointer-events: auto;
        }

        .toast.visible {
            opacity: 1;
            transform: translateY(0);
        }

        .toast-icon {
            font-size: 16px;
        }

        .toast-message {
            font-size: 13px;
            color: #1f2937;
        }

        .toast-success {
            border-left: 3px solid #10b981;
        }

        .toast-error {
            border-left: 3px solid #ef4444;
        }

        .toast-info {
            border-left: 3px solid #3b82f6;
        }

        .toast-warning {
            border-left: 3px solid #f59e0b;
        }

        /* 深色主题适配 */
        .dark-theme .confirm-dialog {
            background: #1e293b;
        }

        .dark-theme .confirm-dialog-header {
            border-bottom-color: #334155;
        }

        .dark-theme .confirm-dialog-title {
            color: #f1f5f9;
        }

        .dark-theme .confirm-dialog-message {
            color: #94a3b8;
        }

        .dark-theme .confirm-dialog-footer {
            background: #0f172a;
            border-top-color: #334155;
        }

        .dark-theme .toast {
            background: #1e293b;
        }

        .dark-theme .toast-message {
            color: #f1f5f9;
        }
    `;
}
