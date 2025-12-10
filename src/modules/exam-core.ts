/**
 * 答题模块 - 完整功能
 */

import { state } from '../utils/state';
import { Logger } from '../utils/logger';
import { Utils } from '../utils/index';
import { CONFIG } from '../ui/config-instance';
import { AI_PRESETS, ConfigManager } from '../utils/config';
import { ErrorHandler } from '../utils/error-handler';
import { DOMCache } from '../utils/dom-cache';
import type { AIConfig, Question, QuestionType, QuestionOption } from '../types/index';

/**
 * 获取AI配置
 */
export function getAIConfig(): AIConfig {
    return ConfigManager.getAIConfig(CONFIG.exam.currentAI);
}

/**
 * 获取当前题目
 */
export function getCurrentQuestion(): Question | null {
    const questionEl = document.querySelector('.single, .multiple, .judge, .fill, .completion');
    if (!questionEl) return null;

    const typeMap: Record<string, QuestionType> = {
        'single': '单选题',
        'multiple': '多选题',
        'judge': '判断题',
        'fill': '填空题',
        'completion': '填空题'
    };
    let questionType: QuestionType = '未知';
    for (const [cls, type] of Object.entries(typeMap)) {
        if (questionEl.classList.contains(cls)) {
            questionType = type;
            break;
        }
    }

    const titleEl = questionEl.querySelector('.single-title-content, .multiple-title-content, .judge-title-content, .fill-title-content, .completion-title-content');
    const questionText = titleEl ? titleEl.textContent?.trim() || '' : '';

    const options: QuestionOption[] = [];
    const optionEls = questionEl.querySelectorAll('.ivu-radio-wrapper, .ivu-checkbox-wrapper');
    optionEls.forEach((optionEl, index) => {
        const optionLabel = String.fromCharCode(65 + index);
        const optionTextEl = optionEl.querySelector('span:last-child');
        const optionText = optionTextEl ? optionTextEl.textContent?.trim() || '' : '';
        options.push({ label: optionLabel, text: optionText, element: optionEl as HTMLElement });
    });

    let fillInputs: HTMLInputElement[] = [];
    if (questionType === '填空题') {
        fillInputs = Array.from(questionEl.querySelectorAll('input[type="text"], textarea, .ivu-input')) as HTMLInputElement[];
    }

    return { type: questionType, text: questionText, options: options, fillInputs: fillInputs, element: questionEl as HTMLElement };
}

/**
 * 构建AI提示词
 */
export function buildPrompt(question: Question): string {
    let prompt = '';
    if (question.type === '单选题') {
        prompt = `这是一道单选题，请仔细分析后选择正确答案。

题目：${question.text}

选项：
`;
        question.options.forEach(opt => { prompt += `${opt.label}. ${opt.text}\n`; });
        prompt += `\n请直接回答选项字母（如：A 或 B 或 C 或 D），不要有其他内容。`;
    } else if (question.type === '多选题') {
        prompt = `这是一道多选题，请仔细分析后选择所有正确答案。

题目：${question.text}

选项：
`;
        question.options.forEach(opt => { prompt += `${opt.label}. ${opt.text}\n`; });
        prompt += `\n请直接回答选项字母，多个答案用逗号分隔（如：A,C,D），不要有其他内容。`;
    } else if (question.type === '判断题') {
        prompt = `这是一道判断题，请判断对错。

题目：${question.text}

`;
        if (question.options.length > 0) {
            prompt += `选项：\n`;
            question.options.forEach(opt => { prompt += `${opt.label}. ${opt.text}\n`; });
            prompt += `\n请直接回答选项字母（如：A 或 B），不要有其他内容。`;
        } else {
            prompt += `\n请直接回答"对"或"错"，不要有其他内容。`;
        }
    } else if (question.type === '填空题') {
        prompt = `这是一道填空题，请给出准确答案。

题目：${question.text}

`;
        if (question.options && question.options.length > 0) {
            prompt += `参考选项：\n`;
            question.options.forEach(opt => { prompt += `${opt.label}. ${opt.text}\n`; });
            prompt += `\n`;
        }
        const blankCount = question.fillInputs.length;
        if (blankCount > 1) {
            prompt += `注意：这道题有 ${blankCount} 个空需要填写。\n`;
            prompt += `请按顺序给出所有空的答案，每个答案之间用分号(;)分隔。\n例如：答案1;答案2;答案3\n\n`;
        }
        prompt += `要求：\n1. 只返回答案内容，不要有任何解释或其他文字\n2. 如果有多个空，务必用分号(;)分隔\n3. 答案要准确简洁`;
    }
    return prompt;
}

/**
 * 调用AI接口
 */
export function askAI(question: Question): Promise<string> {
    return new Promise((resolve, reject) => {
        const aiConfig = getAIConfig();
        const prompt = buildPrompt(question);

        Logger.info(`正在请求AI...`);

        const requestBody = {
            model: aiConfig.model,
            messages: [
                {
                    role: "system",
                    content: "你是一个专业的答题助手。你需要根据题目内容，给出准确的答案。请严格按照要求的格式返回答案。"
                },
                { role: "user", content: prompt }
            ],
            temperature: 0.1,
            max_tokens: 500
        };

        const timeoutId = setTimeout(() => {
            reject(new Error('请求超时，请检查网络连接'));
        }, 30000);

        GM_xmlhttpRequest({
            method: 'POST',
            url: `${aiConfig.baseURL}/chat/completions`,
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${aiConfig.apiKey}`
            },
            data: JSON.stringify(requestBody),
            timeout: 30000,
            onload: function(response) {
                clearTimeout(timeoutId);
                try {
                    if (response.status === 401) {
                        reject(new Error('API Key 无效或已过期，请检查配置'));
                        return;
                    }
                    if (response.status === 403) {
                        reject(new Error('API Key 权限不足或账户余额不足'));
                        return;
                    }
                    if (response.status === 429) {
                        reject(new Error('请求频率过高，请稍后再试'));
                        return;
                    }
                    if (response.status === 500 || response.status === 502 || response.status === 503) {
                        reject(new Error('AI 服务暂时不可用，请稍后再试'));
                        return;
                    }
                    if (response.status !== 200) {
                        // 尝试从响应中获取更详细的错误信息
                        let errorMsg = `API 错误 (${response.status})`;
                        try {
                            const errorData = JSON.parse(response.responseText);
                            if (errorData.error?.message) {
                                errorMsg = errorData.error.message;
                            }
                        } catch {
                            // 忽略解析错误
                        }
                        reject(new Error(errorMsg));
                        return;
                    }

                    const data = JSON.parse(response.responseText);
                    if (data.choices && data.choices.length > 0 && data.choices[0].message?.content) {
                        const answer = data.choices[0].message.content.trim();
                        resolve(answer);
                    } else if (data.error) {
                        reject(new Error(data.error.message || 'API 返回错误'));
                    } else {
                        reject(new Error('AI 返回数据异常，请检查 API 配置'));
                    }
                } catch (error) {
                    Logger.error('解析响应失败:', response.responseText?.substring(0, 200));
                    reject(new Error('解析 AI 响应失败，请检查 API 地址是否正确'));
                }
            },
            onerror: (err) => {
                clearTimeout(timeoutId);
                Logger.error('网络错误:', err);
                reject(new Error('网络请求失败，请检查网络连接和 API 地址'));
            },
            ontimeout: () => {
                clearTimeout(timeoutId);
                reject(new Error('请求超时，请检查网络连接'));
            }
        });
    });
}

/**
 * 查询答案（带重试机制）
 */
export async function searchAnswer(question: Question): Promise<string | null> {
    try {
        const aiConfig = getAIConfig();
        if (!aiConfig.apiKey || aiConfig.apiKey === '') {
            updateExamMessage('请先配置API Key', '#ef4444');
            return null;
        }

        updateExamMessage(`📡 正在使用 ${AI_PRESETS[CONFIG.exam.currentAI].name} 查询...`, '#2196F3');

        // 使用重试机制
        const answer = await Utils.retry(
            () => askAI(question),
            2, // 最多重试2次
            1500 // 重试间隔1.5秒
        );

        return answer;
    } catch (error) {
        Logger.error('查询失败:', (error as Error).message);
        updateExamMessage('❌ 查询失败: ' + (error as Error).message, '#ef4444');
        return null;
    }
}

/**
 * 选择答案
 */
export async function selectAnswer(question: Question, answer: string | null): Promise<boolean> {
    if (!answer) {
        updateExamMessage('未找到答案，跳过此题', '#f59e0b');
        return false;
    }
    try {
        if (question.type === '单选题' || question.type === '判断题') {
            const matchedOption = question.options.find(opt => {
                return answer.includes(opt.label) || answer.includes(opt.text) || opt.text.includes(answer);
            });
            if (matchedOption) {
                const radioInput = matchedOption.element.querySelector('input[type="radio"]') as HTMLInputElement | null;
                if (radioInput) {
                    radioInput.click();
                    updateExamMessage(`已选择答案：${matchedOption.label}`, '#10b981');
                    return true;
                }
            }
        } else if (question.type === '多选题') {
            const answerLabels = answer.match(/[A-Z]/g) || [];
            let selectedCount = 0;
            for (let i = 0; i < answerLabels.length; i++) {
                const label = answerLabels[i];
                const matchedOption = question.options.find(opt => opt.label === label);
                if (matchedOption) {
                    // 尝试多种方式找到checkbox
                    let checkboxInput = matchedOption.element.querySelector('input[type="checkbox"]') as HTMLInputElement | null;
                    if (!checkboxInput) {
                        checkboxInput = matchedOption.element.querySelector('.ivu-checkbox-input') as HTMLInputElement | null;
                    }
                    if (!checkboxInput) {
                        // 直接点击wrapper元素
                        matchedOption.element.click();
                        selectedCount++;
                    } else if (!checkboxInput.checked) {
                        checkboxInput.click();
                        selectedCount++;
                    }
                    // 每次点击后等待一下，确保状态更新
                    await Utils.sleep(200);
                }
            }
            if (selectedCount > 0) {
                updateExamMessage(`已选择答案：${answerLabels.join(', ')}`, '#10b981');
                return true;
            }
        } else if (question.type === '填空题') {
            if (question.fillInputs.length > 0) {
                const answers = answer.split(/[;；]/).map(a => a.trim()).filter(a => a);
                let filledCount = 0;
                question.fillInputs.forEach((input, index) => {
                    if (answers[index]) {
                        input.value = answers[index];
                        input.dispatchEvent(new Event('input', { bubbles: true }));
                        input.dispatchEvent(new Event('change', { bubbles: true }));
                        input.dispatchEvent(new Event('blur', { bubbles: true }));
                        filledCount++;
                    }
                });
                if (filledCount > 0) {
                    updateExamMessage(`已填入 ${filledCount} 个答案`, '#10b981');
                    return true;
                }
            }
        }
        updateExamMessage('答案格式不匹配，跳过此题', '#f59e0b');
        return false;
    } catch {
        return false;
    }
}

/**
 * 点击下一题按钮
 */
export function clickNextButton(): boolean {
    const nextBtn = Array.from(document.querySelectorAll('button')).find(btn => btn.textContent?.includes('下一题'));
    if (nextBtn && !nextBtn.disabled) {
        setTimeout(() => {
            nextBtn.click();
            updateExamMessage('已点击下一题', '#2196F3');
        }, 500);
        return true;
    }
    return false;
}

/**
 * 点击交卷按钮
 */
export async function clickSubmitButton(): Promise<boolean> {
    const submitBtn = Array.from(document.querySelectorAll('button')).find(btn => btn.textContent?.includes('交卷'));
    if (submitBtn && !submitBtn.disabled) {
        if (CONFIG.exam.autoSubmit) {
            updateExamMessage('正在自动交卷...', '#10b981');
            await Utils.sleep(1000);
            submitBtn.click();
            await Utils.sleep(1500);
            const confirmed = await clickConfirmSubmit();
            if (confirmed) {
                updateExamMessage('已自动确认提交', '#10b981');
            }
        } else {
            updateExamMessage('所有题目已完成，请手动交卷', '#10b981');
        }
        return true;
    }
    return false;
}

/**
 * 确认提交
 */
export async function clickConfirmSubmit(): Promise<boolean> {
    for (let i = 0; i < 10; i++) {
        let confirmBtn = Array.from(document.querySelectorAll('button')).find(btn => btn.textContent?.includes('确认提交')) as HTMLButtonElement | undefined;
        if (!confirmBtn) {
            const footer = document.querySelector('.ivu-modal-confirm-footer');
            if (footer) confirmBtn = footer.querySelector('.ivu-btn-primary') as HTMLButtonElement | null ?? undefined;
        }
        if (!confirmBtn) {
            const modal = document.querySelector('.ivu-modal-confirm');
            if (modal) confirmBtn = modal.querySelector('.ivu-btn-primary') as HTMLButtonElement | null ?? undefined;
        }
        if (confirmBtn) {
            await Utils.sleep(500);
            confirmBtn.click();
            await Utils.sleep(2000);
            await clickClosePage();
            return true;
        }
        await Utils.sleep(100);
    }
    return false;
}

/**
 * 关闭页面
 */
export async function clickClosePage(): Promise<boolean> {
    for (let i = 0; i < 15; i++) {
        let closeBtn = Array.from(document.querySelectorAll('button')).find(btn =>
            btn.textContent?.includes('关闭页面') || btn.textContent?.includes('关闭')
        ) as HTMLButtonElement | undefined;
        if (!closeBtn) {
            const footer = document.querySelector('.ivu-modal-confirm-footer');
            if (footer) {
                const primaryBtn = footer.querySelector('.ivu-btn-primary') as HTMLButtonElement | null;
                if (primaryBtn && (primaryBtn.textContent?.includes('关闭') || primaryBtn.textContent?.includes('确定'))) {
                    closeBtn = primaryBtn;
                }
            }
        }
        if (closeBtn) {
            await Utils.sleep(500);
            closeBtn.click();
            updateExamMessage('已完成并关闭页面', '#10b981');
            return true;
        }
        await Utils.sleep(200);
    }
    return false;
}

/**
 * 主答题循环
 */
export async function answerQuestions(): Promise<void> {
    while (state.exam.isRunning) {
        try {
            const question = getCurrentQuestion();
            if (!question || !question.text) {
                const submitted = await clickSubmitButton();
                if (submitted) break;
                await Utils.sleep(2000);
                break;
            }
            state.exam.currentQuestionIndex++;
            updateExamProgress();

            // 记录题目信息
            const shortQuestion = question.text.length > 50 ? question.text.substring(0, 50) + '...' : question.text;
            Logger.info(`【第${state.exam.currentQuestionIndex}题-${question.type}】${shortQuestion}`);

            // 记录选项
            if (question.options.length > 0) {
                const optionsText = question.options.map(opt => `${opt.label}.${opt.text}`).join(' | ');
                const shortOptions = optionsText.length > 80 ? optionsText.substring(0, 80) + '...' : optionsText;
                Logger.info(`选项: ${shortOptions}`);
            }

            updateExamMessage(`正在处理第 ${state.exam.currentQuestionIndex} 题 (${question.type})...`, '#2196F3');

            // 查询答案（带超时保护）
            const answer = await searchAnswer(question);

            if (answer) {
                Logger.success(`AI答案: ${answer}`);
                const selected = await selectAnswer(question, answer);

                if (selected) {
                    updateExamMessage(`✅ 第 ${state.exam.currentQuestionIndex} 题已完成`, '#10b981');
                } else {
                    // 答案格式不匹配，暂停
                    Logger.error(`第${state.exam.currentQuestionIndex}题答案格式不匹配，已暂停`);
                    updateExamMessage(`⚠️ 第 ${state.exam.currentQuestionIndex} 题答案格式不匹配，已暂停`, '#ef4444');
                    stopExam();
                    return;
                }
            } else {
                // 未获取到答案，暂停
                Logger.error(`第${state.exam.currentQuestionIndex}题未获取到答案，已暂停`);
                updateExamMessage(`❌ 第 ${state.exam.currentQuestionIndex} 题查询失败，已暂停`, '#ef4444');
                stopExam();
                return;
            }

            await Utils.sleep(CONFIG.exam.delay);

            const hasNext = clickNextButton();
            if (!hasNext) {
                await Utils.sleep(1000);
                await clickSubmitButton();
                break;
            }
            await Utils.sleep(1000);
        } catch (error) {
            // 捕获任何错误，暂停答题
            Logger.error('答题出错:', error);
            updateExamMessage(`❌ 第 ${state.exam.currentQuestionIndex} 题出错: ${(error as Error).message}，已暂停`, '#ef4444');
            stopExam();
            return;
        }
    }
    state.exam.isRunning = false;
    const startBtn = document.getElementById('exam-start') as HTMLButtonElement | null;
    const stopBtn = document.getElementById('exam-stop') as HTMLButtonElement | null;
    if (startBtn) startBtn.disabled = false;
    if (stopBtn) stopBtn.disabled = true;

    const statusText = document.getElementById('exam-status');
    const statusDot = document.getElementById('exam-status-dot');
    if (statusText) statusText.textContent = '已完成';
    if (statusDot) {
        statusDot.className = 'status-dot completed';
    }

    Logger.info('答题完成');
}

/**
 * 开始答题
 */
export async function startExam(): Promise<void> {
    if (state.exam.isRunning) return;

    const aiConfig = getAIConfig();
    if (!aiConfig.apiKey || aiConfig.apiKey === '') {
        updateExamMessage('❌ 请先配置API Key', '#ef4444');
        return;
    }

    state.exam.isRunning = true;
    state.exam.currentQuestionIndex = 0;
    state.exam.totalQuestions = getTotalQuestions();

    const startBtn = document.getElementById('exam-start') as HTMLButtonElement | null;
    const stopBtn = document.getElementById('exam-stop') as HTMLButtonElement | null;
    if (startBtn) startBtn.disabled = true;
    if (stopBtn) stopBtn.disabled = false;

    const statusText = document.getElementById('exam-status');
    const statusDot = document.getElementById('exam-status-dot');
    if (statusText) statusText.textContent = '运行中';
    if (statusDot) {
        statusDot.className = 'status-dot running';
    }

    updateExamMessage(`开始AI答题（使用 ${AI_PRESETS[CONFIG.exam.currentAI].name}）...`, '#10b981');
    updateExamProgress();

    await answerQuestions();
}

/**
 * 停止答题
 */
export function stopExam(): void {
    state.exam.isRunning = false;
    const startBtn = document.getElementById('exam-start') as HTMLButtonElement | null;
    const stopBtn = document.getElementById('exam-stop') as HTMLButtonElement | null;
    if (startBtn) startBtn.disabled = false;
    if (stopBtn) stopBtn.disabled = true;

    const statusText = document.getElementById('exam-status');
    const statusDot = document.getElementById('exam-status-dot');
    if (statusText) statusText.textContent = '已停止';
    if (statusDot) {
        statusDot.className = 'status-dot';
    }

    updateExamMessage('已停止答题', '#f59e0b');
}

/**
 * 获取总题数
 */
export function getTotalQuestions(): number {
    const answerCard = DOMCache.get('.topic-zpx-list');
    if (answerCard) {
        const questionSpans = answerCard.querySelectorAll('.topic-zpx-main span');
        return questionSpans.length;
    }
    return 0;
}

/**
 * 更新答题进度
 */
export function updateExamProgress(): void {
    DOMCache.setText('exam-progress', `${state.exam.currentQuestionIndex}/${state.exam.totalQuestions}`);

    const percentage = state.exam.totalQuestions > 0
        ? (state.exam.currentQuestionIndex / state.exam.totalQuestions * 100)
        : 0;
    Utils.updateProgressBar('exam-progress-bar', percentage);
}

/**
 * 更新状态消息
 */
export function updateExamMessage(text: string, color: string = '#64748b'): void {
    DOMCache.setText('exam-message', text);
    DOMCache.setStyle('exam-message', { color });
}
