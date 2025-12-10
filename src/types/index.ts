/**
 * 核心类型定义
 */

// ==================== 学习模块类型 ====================

/**
 * 学习节点
 */
export interface LearningNode {
    /** 节点 DOM 元素 */
    element: HTMLElement;
    /** 节点唯一标识 */
    id: string;
    /** 节点标题 */
    title: string;
    /** 是否已完成 */
    isCompleted: boolean;
    /** 是否是考试节点 */
    isExam: boolean;
    /** 节点索引 */
    index: number;
}

/**
 * 学习模式状态
 */
export interface LearningState {
    /** 是否正在运行 */
    isRunning: boolean;
    /** 当前学习节点 */
    currentNode: LearningNode | null;
    /** 所有节点列表 */
    allNodes: LearningNode[];
    /** 已完成数量 */
    completedCount: number;
    /** 总数量 */
    totalCount: number;
    /** 考试节点数量 */
    examCount: number;
    /** 已处理节点 ID 集合 */
    processedNodes: Set<string>;
    /** 已完成章节 ID 集合 */
    completedChapters: Set<string>;
    /** 当前页码（文档） */
    currentPage: number;
    /** 总页数（文档） */
    totalPages: number;
    /** 是否是文档类型 */
    isDocument: boolean;
    /** 是否正在观看媒体 */
    mediaWatching: boolean;
}

// ==================== 答题模块类型 ====================

/**
 * 答题模式状态
 */
export interface ExamState {
    /** 是否正在运行 */
    isRunning: boolean;
    /** 当前题目索引 */
    currentQuestionIndex: number;
    /** 总题目数 */
    totalQuestions: number;
}

/**
 * 题目选项
 */
export interface QuestionOption {
    /** 选项标签 (A, B, C, D) */
    label: string;
    /** 选项文本 */
    text: string;
    /** 选项 DOM 元素 */
    element: HTMLElement;
}

/**
 * 题目类型
 */
export type QuestionType = '单选题' | '多选题' | '判断题' | '填空题' | '未知';

/**
 * 题目
 */
export interface Question {
    /** 题目类型 */
    type: QuestionType;
    /** 题目文本 */
    text: string;
    /** 选项列表 */
    options: QuestionOption[];
    /** 填空输入框列表 */
    fillInputs: HTMLInputElement[];
    /** 题目 DOM 元素 */
    element: HTMLElement;
}

// ==================== 应用状态 ====================

/**
 * 应用全局状态
 */
export interface AppState {
    /** 学习模式状态 */
    learning: LearningState;
    /** 答题模式状态 */
    exam: ExamState;
}

// ==================== 配置类型 ====================

/**
 * AI 配置
 */
export interface AIConfig {
    /** API 密钥 */
    apiKey: string;
    /** API 基础 URL */
    baseURL: string;
    /** 模型名称 */
    model: string;
}

/**
 * AI 预设
 */
export interface AIPreset {
    /** 预设名称 */
    name: string;
    /** API 基础 URL */
    baseURL: string;
    /** 模型名称 */
    model: string;
    /** 默认密钥 */
    defaultKey: string;
    /** 密钥输入提示 */
    keyPlaceholder: string;
}

/**
 * 学习配置
 */
export interface LearningConfig {
    /** 播放倍速 */
    playbackRate: number;
    /** 完成后等待时间（秒） */
    waitTimeAfterComplete: number;
    /** 文档翻页间隔（秒） */
    documentPageInterval: number;
    /** 展开延迟（秒） */
    expandDelay: number;
    /** 是否静音 */
    muteMedia: boolean;
}

/**
 * 答题配置
 */
export interface ExamConfig {
    /** 延迟时间（毫秒） */
    delay: number;
    /** 是否自动提交 */
    autoSubmit: boolean;
    /** 当前 AI 预设 */
    currentAI: string;
}

/**
 * 应用配置
 */
export interface AppConfig {
    /** 学习配置 */
    learning: LearningConfig;
    /** 答题配置 */
    exam: ExamConfig;
    /** 主题 */
    theme: 'light' | 'dark';
    /** 当前标签页 */
    currentTab: string;
}

// ==================== 辅助类型 ====================

/**
 * 页面信息
 */
export interface PageInfo {
    /** 当前页码 */
    current: number;
    /** 总页数 */
    total: number;
}

/**
 * 日志类型
 */
export type LogType = 'info' | 'success' | 'warn' | 'error';

/**
 * 日志条目
 */
export interface LogEntry {
    /** 日志类型 */
    type: LogType;
    /** 日志消息 */
    message: string;
    /** 时间戳 */
    time: string;
}

/**
 * 面板位置
 */
export interface PanelPosition {
    /** 左边距 */
    left: number;
    /** 上边距 */
    top: number;
    /** 保存时间戳 */
    timestamp: number;
}

/**
 * 错误类型枚举
 */
export enum ErrorType {
    NETWORK = 'NETWORK',
    API = 'API',
    PARSE = 'PARSE',
    DOM = 'DOM',
    CONFIG = 'CONFIG',
    TIMEOUT = 'TIMEOUT',
    VALIDATION = 'VALIDATION',
    UNKNOWN = 'UNKNOWN'
}

/**
 * DOM 缓存项
 */
export interface DOMCacheItem {
    /** 缓存的元素 */
    element: HTMLElement | null;
    /** 缓存时间 */
    time: number;
}

/**
 * 状态变化监听器
 */
export type StateListener = (path: string, newValue: unknown, oldValue: unknown) => void;
