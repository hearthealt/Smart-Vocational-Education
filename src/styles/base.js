/**
 * 基础样式 - 面板容器、头部、标签页导航
 */
export const baseStyles = `
/* ==================== 字体定义 ==================== */
/* 使用系统字体栈作为回退，确保国内用户体验 */
@font-face {
    font-family: 'Outfit';
    font-style: normal;
    font-weight: 300 800;
    font-display: swap;
    src: local('Outfit'),
         url('https://fonts.loli.net/css2?family=Outfit:wght@300;400;500;600;700;800&display=swap') format('woff2'),
         url('https://cdn.jsdelivr.net/npm/@fontsource/outfit@5.0.8/files/outfit-latin-400-normal.woff2') format('woff2');
}

@font-face {
    font-family: 'JetBrains Mono';
    font-style: normal;
    font-weight: 400 600;
    font-display: swap;
    src: local('JetBrains Mono'),
         url('https://fonts.loli.net/css2?family=JetBrains+Mono:wght@400;500;600&display=swap') format('woff2'),
         url('https://cdn.jsdelivr.net/npm/@fontsource/jetbrains-mono@5.0.18/files/jetbrains-mono-latin-400-normal.woff2') format('woff2');
}

/* 字体回退栈 */
.icve-font-sans {
    font-family: 'Outfit', -apple-system, BlinkMacSystemFont, 'Segoe UI', 'PingFang SC', 'Hiragino Sans GB', 'Microsoft YaHei', sans-serif;
}

.icve-font-mono {
    font-family: 'JetBrains Mono', 'SF Mono', 'Fira Code', 'Consolas', 'Monaco', monospace;
}

/* ==================== 基础面板样式 ==================== */
#icve-tabbed-panel {
    position: fixed;
    top: 24px;
    right: 24px;
    width: var(--icve-panel-width);
    max-width: calc(100vw - 32px);
    max-height: 92vh;
    z-index: 999999;
    font-family: 'Outfit', -apple-system, BlinkMacSystemFont, 'Segoe UI', 'PingFang SC', 'Microsoft YaHei', sans-serif;
    animation: icvePanelEnter 0.7s var(--icve-ease-out-expo);
}

@keyframes icvePanelEnter {
    0% {
        opacity: 0;
        transform: translateX(80px) scale(0.92) rotateY(-8deg);
        filter: blur(8px);
    }
    100% {
        opacity: 1;
        transform: translateX(0) scale(1) rotateY(0);
        filter: blur(0);
    }
}

/* 小屏幕位置调整 */
@media (max-width: 480px) {
    #icve-tabbed-panel {
        top: 16px;
        right: 16px;
        max-height: 85vh;
    }
}

.panel-container {
    background: var(--icve-bg-glass);
    backdrop-filter: blur(24px) saturate(180%);
    -webkit-backdrop-filter: blur(24px) saturate(180%);
    border-radius: 24px;
    border: 1px solid var(--icve-border-subtle);
    box-shadow:
        var(--icve-shadow-elevated),
        var(--icve-shadow-glow),
        inset 0 1px 1px rgba(255, 255, 255, 0.6);
    overflow: hidden;
    display: flex;
    flex-direction: column;
    max-height: 92vh;
    transition: all var(--icve-duration-normal) var(--icve-ease-out-expo);
    position: relative;
}

/* 面板光晕背景 */
.panel-container::before {
    content: '';
    position: absolute;
    top: -50%;
    left: -50%;
    width: 200%;
    height: 200%;
    background: radial-gradient(
        ellipse at 30% 20%,
        rgba(99, 102, 241, 0.08) 0%,
        transparent 50%
    ),
    radial-gradient(
        ellipse at 70% 80%,
        rgba(217, 70, 239, 0.06) 0%,
        transparent 50%
    );
    pointer-events: none;
    z-index: 0;
}

.panel-container:hover {
    box-shadow:
        0 32px 64px rgba(15, 23, 42, 0.16),
        0 0 80px rgba(139, 92, 246, 0.2),
        inset 0 1px 1px rgba(255, 255, 255, 0.6);
}

/* 小屏幕圆角调整 */
@media (max-width: 480px) {
    .panel-container {
        border-radius: 18px;
        max-height: 85vh;
    }
}

/* ==================== 头部样式 ==================== */
.panel-header {
    padding: 18px var(--icve-panel-padding);
    background: linear-gradient(
        135deg,
        var(--icve-primary-from) 0%,
        var(--icve-primary-via) 50%,
        var(--icve-primary-to) 100%
    );
    cursor: move;
    display: flex;
    justify-content: space-between;
    align-items: center;
    user-select: none;
    position: relative;
    z-index: 1;
    overflow: hidden;
}

/* 头部动态光效 */
.panel-header::before {
    content: '';
    position: absolute;
    top: 0;
    left: -100%;
    width: 100%;
    height: 100%;
    background: linear-gradient(
        90deg,
        transparent 0%,
        rgba(255, 255, 255, 0.2) 50%,
        transparent 100%
    );
    animation: headerShine 4s ease-in-out infinite;
}

@keyframes headerShine {
    0%, 100% { left: -100%; }
    50% { left: 100%; }
}

/* 头部底部渐变线 */
.panel-header::after {
    content: '';
    position: absolute;
    bottom: 0;
    left: 0;
    right: 0;
    height: 1px;
    background: linear-gradient(
        90deg,
        transparent 0%,
        rgba(255, 255, 255, 0.4) 50%,
        transparent 100%
    );
}

.panel-title {
    font-weight: 700;
    font-size: 16px;
    color: var(--icve-text-inverted);
    text-shadow: 0 2px 8px rgba(0, 0, 0, 0.2);
    letter-spacing: 0.5px;
    position: relative;
    z-index: 1;
    display: flex;
    align-items: center;
    gap: 8px;
}

.panel-title::before {
    content: '';
    width: 8px;
    height: 8px;
    background: var(--icve-text-inverted);
    border-radius: 50%;
    box-shadow: 0 0 12px rgba(255, 255, 255, 0.6);
    animation: titlePulse 2s ease-in-out infinite;
}

@keyframes titlePulse {
    0%, 100% { opacity: 1; transform: scale(1); }
    50% { opacity: 0.6; transform: scale(0.8); }
}

/* 小屏幕标题字号 */
@media (max-width: 480px) {
    .panel-title {
        font-size: 14px;
    }
}

.header-controls {
    display: flex;
    gap: 10px;
    position: relative;
    z-index: 1;
}

/* 头部控制按钮 */
.theme-toggle, .panel-toggle {
    background: rgba(255, 255, 255, 0.18);
    border: 1px solid rgba(255, 255, 255, 0.25);
    color: white;
    width: 36px;
    height: 36px;
    border-radius: 12px;
    cursor: pointer;
    font-size: 16px;
    transition: all var(--icve-duration-normal) var(--icve-ease-spring);
    display: flex;
    align-items: center;
    justify-content: center;
    backdrop-filter: blur(8px);
    position: relative;
    overflow: hidden;
}

.theme-toggle::before, .panel-toggle::before {
    content: '';
    position: absolute;
    inset: 0;
    background: rgba(255, 255, 255, 0);
    transition: background var(--icve-duration-fast) ease;
}

.theme-toggle:hover, .panel-toggle:hover {
    background: rgba(255, 255, 255, 0.28);
    border-color: rgba(255, 255, 255, 0.4);
    transform: scale(1.08) rotate(6deg);
    box-shadow: 0 6px 20px rgba(0, 0, 0, 0.2);
}

.theme-toggle:hover::before, .panel-toggle:hover::before {
    background: rgba(255, 255, 255, 0.1);
}

.theme-toggle:active, .panel-toggle:active {
    transform: scale(0.96) rotate(0deg);
    transition: transform 0.1s ease;
}

/* 小屏幕按钮尺寸 */
@media (max-width: 480px) {
    .theme-toggle, .panel-toggle {
        width: 32px;
        height: 32px;
        font-size: 14px;
    }

    .header-controls {
        gap: 8px;
    }
}

/* ==================== 标签页导航 ==================== */
.tab-nav {
    display: flex;
    background: var(--icve-bg-sunken);
    padding: 8px 12px 0;
    gap: 4px;
    position: relative;
    z-index: 1;
}

.tab-nav.collapsed {
    display: none;
}

.tab-btn {
    flex: 1;
    padding: 14px 16px;
    background: transparent;
    border: none;
    cursor: pointer;
    font-family: 'Outfit', -apple-system, BlinkMacSystemFont, sans-serif;
    font-size: 14px;
    font-weight: 600;
    color: var(--icve-text-tertiary);
    transition: all var(--icve-duration-normal) var(--icve-ease-out-expo);
    position: relative;
    border-radius: 14px 14px 0 0;
    letter-spacing: 0.3px;
}

.tab-btn:hover {
    color: var(--icve-primary-via);
    background: rgba(139, 92, 246, 0.08);
}

.tab-btn.active {
    color: var(--icve-primary-via);
    background: var(--icve-bg-glass-strong);
    box-shadow: 0 -4px 16px rgba(139, 92, 246, 0.1);
}

.tab-btn.active::after {
    content: '';
    position: absolute;
    bottom: 0;
    left: 16px;
    right: 16px;
    height: 3px;
    background: linear-gradient(
        90deg,
        var(--icve-primary-from),
        var(--icve-primary-via),
        var(--icve-primary-to)
    );
    border-radius: 3px 3px 0 0;
    animation: tabIndicator 0.4s var(--icve-ease-spring);
}

@keyframes tabIndicator {
    from {
        transform: scaleX(0);
        opacity: 0;
    }
    to {
        transform: scaleX(1);
        opacity: 1;
    }
}

/* 小屏幕标签页 */
@media (max-width: 480px) {
    .tab-nav {
        padding: 6px 8px 0;
    }

    .tab-btn {
        padding: 10px 8px;
        font-size: 12px;
    }
}

/* ==================== 标签页内容 ==================== */
.tab-content-wrapper {
    overflow-y: auto;
    max-height: calc(92vh - 140px);
    scrollbar-width: thin;
    scrollbar-color: rgba(139, 92, 246, 0.3) transparent;
    scrollbar-gutter: stable;
    position: relative;
    z-index: 1;
}

.tab-content-wrapper::-webkit-scrollbar {
    width: 6px;
}

.tab-content-wrapper::-webkit-scrollbar-track {
    background: transparent;
}

.tab-content-wrapper::-webkit-scrollbar-thumb {
    background: linear-gradient(
        180deg,
        var(--icve-primary-from),
        var(--icve-primary-to)
    );
    border-radius: 10px;
}

.tab-content-wrapper::-webkit-scrollbar-thumb:hover {
    background: linear-gradient(
        180deg,
        var(--icve-primary-via),
        var(--icve-primary-to)
    );
}

.tab-content-wrapper.collapsed {
    display: none;
}

/* 小屏幕滚动区域 */
@media (max-width: 480px) {
    .tab-content-wrapper {
        max-height: calc(85vh - 120px);
    }
}

.tab-pane {
    display: none;
    background: var(--icve-bg-glass-strong);
    animation: tabPaneFade 0.5s var(--icve-ease-out-expo);
}

@keyframes tabPaneFade {
    from {
        opacity: 0;
        transform: translateY(16px);
    }
    to {
        opacity: 1;
        transform: translateY(0);
    }
}

.tab-pane.active {
    display: block;
}

.tab-inner {
    padding: var(--icve-panel-padding);
}

/* 小屏幕内边距 */
@media (max-width: 480px) {
    .tab-inner {
        padding: 14px;
    }
}
`;
