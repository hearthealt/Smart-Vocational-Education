/**
 * 学习页面专属样式
 */
export const learningStyles = `
/* ==================== 学习控制区 ==================== */
.learning-controls {
    display: flex;
    flex-direction: column;
    gap: 10px;
    margin-bottom: 14px;
}

/* 小屏幕学习控制区 */
@media (max-width: 480px) {
    .learning-controls {
        gap: 8px;
        margin-bottom: 12px;
    }
}
`;
