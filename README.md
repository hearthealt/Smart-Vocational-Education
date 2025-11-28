# 🎓 智慧职教全能助手

[![Version](https://img.shields.io/badge/version-1.3.0-blue.svg)](https://github.com/hearthealt/Smart-Vocational-Education)
[![License](https://img.shields.io/badge/license-MIT-green.svg)](LICENSE)
[![Platform](https://img.shields.io/badge/platform-智慧职教MOOC-orange.svg)](https://mooc.icve.com.cn)

智慧职教MOOC学习助手 - 集成自动学习和AI智能答题功能的用户脚本

## ✨ 功能特性

### 📚 学习模式
- **自动学习**: 自动播放课程视频、音频和浏览文档
- **智能跳过**: 自动识别并跳过考试/测验节点
- **章节管理**: 自动展开未完成章节,记录学习进度
- **倍速播放**: 支持1x-16x倍速播放,快速完成学习
- **静音模式**: 可选静音播放,不影响其他操作
- **进度保存**: 自动保存学习进度,刷新页面不丢失
- **文档翻页**: 自动翻页浏览文档类内容
- **智能检测**: 自动处理"继续播放"提示框

### 🤖 答题模式
- **AI智能答题**: 支持多种AI模型自动答题
- **多模型支持**:
  - DeepSeek
  - 智谱AI (ChatGLM)
  - Kimi
  - Doubao (豆包)
  - 讯飞星火
  - 自定义API
- **自动提交**: 可选自动交卷功能
- **答题间隔**: 可配置答题延迟,模拟真实答题
- **高准确率**: 基于大语言模型,答题准确率高
- **多选题支持**: 正确处理多选题选项

### 📋 日志系统
- **实时日志**: 详细记录所有操作和状态
- **分类显示**: 信息、成功、警告、错误分类显示
- **详细信息**: 答题时显示完整题目和选项
- **日志管理**: 支持清空日志功能

### 🎨 界面特性
- **现代化UI**: 采用玻璃拟态设计,美观大方
- **深色模式**: 支持浅色/深色主题切换
- **可拖拽**: 面板可自由拖拽位置
- **可折叠**: 支持折叠面板,状态持久化保存
- **响应式**: 自适应不同屏幕尺寸
- **智能显示**: 根据页面自动显示对应功能

## 📦 安装使用

### 前置条件
1. 安装浏览器扩展管理器:
   - [Tampermonkey](https://www.tampermonkey.net/) (推荐)
   - [Violentmonkey](https://violentmonkey.github.io/)
   - [Greasemonkey](https://www.greasespot.net/) (仅Firefox)

### 安装脚本
点击下方链接安装脚本:

**[📥 安装智慧职教全能助手](https://raw.githubusercontent.com/hearthealt/Smart-Vocational-Education/master/dist/icve-helper.user.js)**

或者手动安装:
1. 打开 Tampermonkey 管理面板
2. 点击"添加新脚本"
3. 复制 `dist/icve-helper.user.js` 的内容
4. 粘贴到编辑器并保存

### 使用方法

#### 学习模式
1. 打开智慧职教MOOC课程学习页面
2. 点击右上角的脚本面板
3. 在"学习"标签页中配置学习参数:
   - **播放倍速**: 选择视频播放速度 (1x-16x)
   - **完成等待**: 设置学习完成后等待时间 (1-30秒)
   - **翻页间隔**: 设置文档翻页间隔 (1-60秒)
   - **静音模式**: 开启/关闭静音播放
4. 点击"▶️ 开始学习"按钮
5. 脚本将自动:
   - 扫描所有学习节点
   - 按顺序学习未完成的内容
   - 自动跳过考试节点
   - 自动展开新章节
   - 自动处理"继续播放"提示
   - 播放视频/音频或浏览文档

#### 答题模式
1. 打开智慧职教MOOC考试/测验页面
2. 在"答题"标签页中配置:
   - **AI模型**: 选择使用的AI服务
   - **API Key**: 输入对应AI服务的API密钥
   - **答题间隔**: 设置答题延迟 (1-30秒)
   - **自动交卷**: 开启/关闭自动提交
3. 点击"🤖 开始答题"按钮
4. 脚本将自动:
   - 识别题目类型
   - 调用AI获取答案
   - 自动填写答案
   - 可选自动提交试卷

## ⚙️ 配置说明

### 学习配置
| 配置项 | 说明 | 默认值 | 范围 |
|--------|------|--------|------|
| 播放倍速 | 视频/音频播放速度 | 2.0x | 1x-16x |
| 完成等待 | 完成后等待下一节点时间 | 3秒 | 1-30秒 |
| 翻页间隔 | 文档翻页间隔时间 | 5秒 | 1-60秒 |
| 展开延迟 | 章节展开等待时间 | 2秒 | 1-10秒 |
| 静音模式 | 是否静音播放 | 关闭 | 开/关 |

### 答题配置
| 配置项 | 说明 | 默认值 |
|--------|------|--------|
| AI模型 | 使用的AI服务 | DeepSeek |
| API Key | AI服务密钥 | 无 |
| API地址 | AI服务地址 | 预设 |
| 模型名称 | 具体模型名 | 预设 |
| 答题间隔 | 每题答题延迟 | 3秒 |
| 自动交卷 | 是否自动提交 | 关闭 |

## 🔑 获取API Key

### DeepSeek (推荐)
1. 访问 [DeepSeek开放平台](https://platform.deepseek.com/)
2. 注册并登录账号
3. 在"API Keys"页面创建新密钥
4. 复制密钥填入脚本配置

### 智谱AI (ChatGLM)
1. 访问 [智谱AI开放平台](https://open.bigmodel.cn/)
2. 注册并登录
3. 创建API Key
4. 复制填入配置

### 其他AI服务
类似流程,访问对应平台的开放平台页面获取API密钥

## 🛠️ 开发构建

### 环境要求
- Node.js >= 16.0.0
- npm >= 8.0.0

### 本地开发
```bash
# 克隆仓库
git clone https://github.com/hearthealt/Smart-Vocational-Education.git
cd Smart-Vocational-Education

# 安装依赖
npm install

# 开发模式 (支持热重载)
npm run dev

# 构建生产版本 (智能版本管理)
npm run build

# 直接构建 (不更新版本)
npm run build:direct
```

### 智能构建系统

本项目采用智能版本管理系统,运行 `npm run build` 时会自动引导你完成:

1. **选择版本类型**
   - Patch (1.3.0 → 1.3.1): 修复bug、小改进
   - Minor (1.3.0 → 1.4.0): 新增功能、功能增强
   - Major (1.3.0 → 2.0.0): 重大更新、架构变更
   - 跳过更新: 仅重新构建

2. **输入更新内容**
   - 按类别输入: 新增/改进/修复/删除
   - 自动生成符合规范的更新日志

3. **自动更新文件**
   - package.json - 版本号
   - vite.config.js - UserScript版本
   - CHANGELOG.md - 更新日志

4. **执行构建**
   - 使用 Vite 构建生产版本
   - 输出到 dist/ 目录

**详细使用说明**: [scripts/README.md](scripts/README.md)

### 项目结构
```
icve-helper/
├── src/
│   ├── main.js                 # 主入口文件
│   ├── modules/                # 功能模块
│   │   ├── learning-core.js    # 学习核心逻辑
│   │   └── exam-core.js        # 答题核心逻辑
│   ├── ui/                     # UI组件
│   │   ├── learning-tab.js     # 学习标签页
│   │   ├── exam-tab.js         # 答题标签页
│   │   ├── log-tab.js          # 日志标签页
│   │   └── config-instance.js  # 配置管理
│   ├── utils/                  # 工具函数
│   │   ├── index.js            # 通用工具
│   │   ├── logger.js           # 日志系统
│   │   ├── config.js           # 配置定义
│   │   └── state.js            # 状态管理
│   └── styles/                 # 样式文件
│       └── index.js            # CSS样式
├── dist/                       # 构建输出目录
│   └── icve-helper.user.js     # 最终用户脚本
├── vite.config.js              # Vite配置
├── package.json                # 项目配置
├── README.md                   # 说明文档
└── CHANGELOG.md                # 更新日志
```

## ⚠️ 注意事项

### 使用限制
- 本脚本仅支持智慧职教MOOC平台 (icve.com.cn)
- 仅用于辅助学习,请合理使用
- 答题功能需要有效的AI API密钥
- API调用可能产生费用,请注意使用量

### 免责声明
- 本脚本仅供学习交流使用
- 使用本脚本产生的任何后果由使用者自行承担
- 请遵守平台规则,不要滥用自动化功能
- 建议配合真实学习,理解课程内容

### 安全提示
- API密钥存储在本地浏览器
- 不会上传任何个人信息
- 所有网络请求均为必要的功能调用
- 建议定期更换API密钥

## 🐛 问题反馈

如果遇到问题或有建议,请:
- 在 [Issues](https://github.com/hearthealt/Smart-Vocational-Education/issues) 提交问题
- 详细描述问题和复现步骤
- 提供浏览器版本和脚本管理器版本

## 📄 开源协议

本项目采用 [MIT License](LICENSE) 开源协议

## 🙏 致谢

感谢以下开源项目:
- [Vite](https://vitejs.dev/) - 现代化构建工具
- [vite-plugin-monkey](https://github.com/lisonge/vite-plugin-monkey) - UserScript构建插件
- 各AI平台提供的API服务

## 📝 更新日志

查看 [CHANGELOG.md](CHANGELOG.md) 了解详细更新历史

---

⭐ 如果觉得有用,请给个Star支持一下!
