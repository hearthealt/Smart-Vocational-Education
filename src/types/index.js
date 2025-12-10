/**
 * 类型定义文件 - 使用 JSDoc 为 JavaScript 提供类型提示
 * 这些类型定义可以被 IDE 识别，提供代码补全和类型检查
 */

/**
 * @typedef {Object} LearningNode
 * @property {HTMLElement} element - 节点 DOM 元素
 * @property {string} id - 节点唯一标识
 * @property {string} title - 节点标题
 * @property {boolean} isCompleted - 是否已完成
 * @property {boolean} isExam - 是否是考试节点
 * @property {number} index - 节点索引
 */

/**
 * @typedef {Object} LearningState
 * @property {boolean} isRunning - 是否正在运行
 * @property {LearningNode|null} currentNode - 当前学习节点
 * @property {LearningNode[]} allNodes - 所有节点列表
 * @property {number} completedCount - 已完成数量
 * @property {number} totalCount - 总数量
 * @property {number} examCount - 考试节点数量
 * @property {Set<string>} processedNodes - 已处理节点 ID 集合
 * @property {Set<string>} completedChapters - 已完成章节 ID 集合
 * @property {number} currentPage - 当前页码（文档）
 * @property {number} totalPages - 总页数（文档）
 * @property {boolean} isDocument - 是否是文档类型
 * @property {boolean} mediaWatching - 是否正在观看媒体
 */

/**
 * @typedef {Object} ExamState
 * @property {boolean} isRunning - 是否正在运行
 * @property {number} currentQuestionIndex - 当前题目索引
 * @property {number} totalQuestions - 总题目数
 */

/**
 * @typedef {Object} AppState
 * @property {LearningState} learning - 学习模式状态
 * @property {ExamState} exam - 答题模式状态
 */

/**
 * @typedef {Object} QuestionOption
 * @property {string} label - 选项标签 (A, B, C, D)
 * @property {string} text - 选项文本
 * @property {HTMLElement} element - 选项 DOM 元素
 */

/**
 * @typedef {Object} Question
 * @property {'单选题'|'多选题'|'判断题'|'填空题'|'未知'} type - 题目类型
 * @property {string} text - 题目文本
 * @property {QuestionOption[]} options - 选项列表
 * @property {HTMLInputElement[]} fillInputs - 填空输入框列表
 * @property {HTMLElement} element - 题目 DOM 元素
 */

/**
 * @typedef {Object} AIConfig
 * @property {string} apiKey - API 密钥
 * @property {string} baseURL - API 基础 URL
 * @property {string} model - 模型名称
 */

/**
 * @typedef {Object} AIPreset
 * @property {string} name - 预设名称
 * @property {string} baseURL - API 基础 URL
 * @property {string} model - 模型名称
 * @property {string} defaultKey - 默认密钥
 * @property {string} keyPlaceholder - 密钥输入提示
 */

/**
 * @typedef {Object} PageInfo
 * @property {number} current - 当前页码
 * @property {number} total - 总页数
 */

/**
 * @typedef {Object} LogEntry
 * @property {'info'|'success'|'warn'|'error'} type - 日志类型
 * @property {string} message - 日志消息
 * @property {string} time - 时间戳
 */

/**
 * @typedef {Object} PanelPosition
 * @property {number} left - 左边距
 * @property {number} top - 上边距
 * @property {number} timestamp - 保存时间戳
 */

/**
 * @typedef {Object} DetailsState
 * @property {Object.<string, boolean>} [detailsId] - details 元素 ID 与展开状态的映射
 */

/**
 * 错误类型枚举
 * @enum {string}
 */
export const ErrorType = {
    NETWORK: 'NETWORK',
    API: 'API',
    PARSE: 'PARSE',
    DOM: 'DOM',
    CONFIG: 'CONFIG',
    UNKNOWN: 'UNKNOWN'
};

/**
 * 日志类型枚举
 * @enum {string}
 */
export const LogType = {
    INFO: 'info',
    SUCCESS: 'success',
    WARN: 'warn',
    ERROR: 'error'
};

// 导出空对象以便其他模块可以导入类型
export default {};
