import { readFileSync, writeFileSync } from "fs";
import { execSync } from "child_process";
import readline from "readline";
import OpenAI from "openai";

// 终端颜色工具
const colors = {
  reset: '\x1b[0m',
  bright: '\x1b[1m',
  dim: '\x1b[2m',
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  magenta: '\x1b[35m',
  cyan: '\x1b[36m',
  white: '\x1b[37m',
};

const log = {
  info: (msg) => console.log(`${colors.blue}ℹ${colors.reset} ${msg}`),
  success: (msg) => console.log(`${colors.green}✓${colors.reset} ${msg}`),
  warn: (msg) => console.log(`${colors.yellow}⚠${colors.reset} ${msg}`),
  error: (msg) => console.log(`${colors.red}✖${colors.reset} ${msg}`),
  title: (msg) => console.log(`\n${colors.bright}${colors.cyan}${msg}${colors.reset}\n`),
  step: (msg) => console.log(`${colors.magenta}▸${colors.reset} ${msg}`),
};

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

function getAiConfig() {
  try {
    const cfg =
      /** @type {{ baseURL?: string; apiKey?: string; model?: string }} */ (
        JSON.parse(readFileSync("./ai.config.json", "utf-8"))
      );
    return {
      baseURL: cfg.baseURL || "https://apis.iflow.cn/v1",
      apiKey: cfg.apiKey || "",
      model: cfg.model || "qwen3-max",
    };
  } catch {
    return {
      baseURL: "https://apis.iflow.cn/v1",
      apiKey: "",
      model: "qwen3-max",
    };
  }
}

const aiConfig = getAiConfig();

function getCurrentVersion() {
  const packageJson = JSON.parse(readFileSync("./package.json", "utf-8"));
  return packageJson.version;
}

function bumpVersion(version, type) {
  const parts = version.split(".").map(Number);
  switch (type) {
    case "major":
      parts[0]++;
      parts[1] = 0;
      parts[2] = 0;
      break;
    case "minor":
      parts[1]++;
      parts[2] = 0;
      break;
    case "patch":
      parts[2]++;
      break;
    default:
      break;
  }
  return parts.join(".");
}

function updatePackageJson(newVersion) {
  const packageJson = JSON.parse(readFileSync("./package.json", "utf-8"));
  packageJson.version = newVersion;
  writeFileSync("./package.json", JSON.stringify(packageJson, null, 2) + "\n");
}

function updateViteConfig(newVersion) {
  let viteConfig = readFileSync("./vite.config.js", "utf-8");
  viteConfig = viteConfig.replace(
    /version:\s*['"][\d.]+['"]/,
    `version: '${newVersion}'`,
  );
  writeFileSync("./vite.config.js", viteConfig);
}

function getDefaultChanges(versionType) {
  const changes = { "1": [], "2": [], "3": [], "4": [] };

  switch (versionType) {
    case "patch":
      changes["3"].push("修复了一些已知问题并提升稳定性。");
      break;
    case "minor":
      changes["1"].push("新增了一些功能和体验优化。");
      changes["3"].push("修复了一些已知问题。");
      break;
    case "major":
      changes["1"].push("进行了重要功能升级和大幅优化。");
      changes["2"].push("调整了部分交互和行为逻辑。");
      changes["3"].push("修复了多项已知问题。");
      break;
    default:
      break;
  }

  return changes;
}

function updateChangelog(newVersion, changes) {
  const date = new Date().toISOString().split("T")[0];
  const changelog = readFileSync("./CHANGELOG.md", "utf-8");

  let newEntry = `## [${newVersion}] - ${date}\n\n`;

  const categoryMap = {
    "1": { name: "新增", key: "Added" },
    "2": { name: "改进", key: "Changed" },
    "3": { name: "修复", key: "Fixed" },
    "4": { name: "删除", key: "Removed" },
  };

  for (const [category, items] of Object.entries(changes)) {
    if (items.length > 0) {
      const categoryName = categoryMap[category].name;
      newEntry += `### ${categoryName}\n`;
      for (const item of items) {
        newEntry += `- ${item}\n`;
      }
      newEntry += "\n";
    }
  }

  const versionRegex = /## \[[\d.]+\]/;
  const match = changelog.match(versionRegex);

  if (match) {
    const insertIndex = changelog.indexOf(match[0]);
    const updated =
      changelog.slice(0, insertIndex) + newEntry + changelog.slice(insertIndex);
    writeFileSync("./CHANGELOG.md", updated);
  } else {
    writeFileSync("./CHANGELOG.md", changelog + "\n" + newEntry);
  }
}

function updateChangelogWithRaw(newVersion, rawMarkdown) {
  const date = new Date().toISOString().split("T")[0];
  const changelog = readFileSync("./CHANGELOG.md", "utf-8");

  const trimmed = rawMarkdown.trim();
  const newEntry =
    `## [${newVersion}] - ${date}\n\n` +
    (trimmed.length > 0 ? `${trimmed}\n\n` : "");

  const versionRegex = /## \[[\d.]+\]/;
  const match = changelog.match(versionRegex);

  if (match) {
    const insertIndex = changelog.indexOf(match[0]);
    const updated =
      changelog.slice(0, insertIndex) + newEntry + changelog.slice(insertIndex);
    writeFileSync("./CHANGELOG.md", updated);
  } else {
    writeFileSync("./CHANGELOG.md", changelog + "\n" + newEntry);
  }
}

function question(prompt) {
  return new Promise((resolve) => {
    rl.question(prompt, resolve);
  });
}

async function generateAiChangelog(newVersion, versionType) {
  if (!aiConfig.apiKey) {
    throw new Error(
      "未找到 API Key（ai.config.json 中的 apiKey 为空），无法调用在线 AI。",
    );
  }

  const openai = new OpenAI({
    baseURL: aiConfig.baseURL,
    apiKey: aiConfig.apiKey,
  });

  let gitSummary = "";
  let gitDiffStat = "";
  let changelogPreview = "";

  try {
    gitSummary = execSync('git log -5 --pretty=format:"%h %s"', {
      encoding: "utf-8",
      stdio: ["ignore", "pipe", "ignore"],
    });
  } catch {}

  try {
    gitDiffStat = execSync("git diff --stat HEAD~1..HEAD", {
      encoding: "utf-8",
      stdio: ["ignore", "pipe", "ignore"],
    });
  } catch {}

  try {
    const changelog = readFileSync("./CHANGELOG.md", "utf-8");
    // 只截取前一部分作为示例，防止内容过长
    changelogPreview = changelog.slice(0, 2000);
  } catch {}

  const extra = await question(
    "可选：请输入本次更新的简要说明（直接回车跳过）: ",
  );

  const versionTypeText =
    versionType === "major"
      ? "大版本（Major）"
      : versionType === "minor"
      ? "小版本（Minor）"
      : "补丁版本（Patch）";

  const messages = [
    {
      role: "system",
      content:
        "你是一个前端项目的开发助手，本项目的更新日志采用 Keep a Changelog 风格。" +
        "请根据提供的信息生成本次版本在 CHANGELOG.md 中的内容，不要输出版本标题行（例如 `## [1.2.3] - 2025-01-01`）。" +
        "使用简体中文和 Markdown 格式，严格使用三级标题（###）作为小节标题。" +
        "按需输出以下小节，保持这个顺序：\"新增\"、\"改进\"、\"修复\"、\"删除\"、\"代码清理\"、\"技术栈\"，" +
        "如果某个小节没有内容可以省略该小节。" +
        "每条更新使用 `- ` 开头的无序列表，必要时可以在同一条下面用两个空格缩进的子项补充细节。" +
        "语气保持简洁、偏技术说明，避免夸张宣传语，也不要额外写总结或说明文字。",
    },
    {
      role: "user",
      content: [
        `版本号: ${newVersion}`,
        `版本类型: ${versionTypeText}`,
        extra ? `开发者补充说明: ${extra}` : "",
        changelogPreview
          ? `以下是当前项目已有的 CHANGELOG 示例片段（供你参考风格，无需照搬版本号）:\n${changelogPreview}`
          : "",
        gitSummary ? `最近提交记录:\n${gitSummary}` : "",
        gitDiffStat ? `最近一次 diff 统计:\n${gitDiffStat}` : "",
      ]
        .filter(Boolean)
        .join("\n\n"),
    },
  ];

  const completion = await openai.chat.completions.create({
    model: aiConfig.model,
    messages,
  });

  const content = completion.choices?.[0]?.message?.content;
  if (!content) {
    throw new Error("AI 未返回内容");
  }

  return typeof content === "string" ? content : String(content);
}

async function main() {
  try {
    const startTime = Date.now();
    
    log.title('🚀 智慧职教全能助手 - 构建工具');
    
    const currentVersion = getCurrentVersion();
    log.info(`当前版本: ${colors.bright}${currentVersion}${colors.reset}`);
    
    console.log('\n' + colors.cyan + '版本更新选项:' + colors.reset);
    console.log('  1. 补丁版本 (Patch) - 修复 bug');
    console.log('  2. 小版本 (Minor) - 新增功能');
    console.log('  3. 大版本 (Major) - 重大更新');
    console.log('  4. 不更新版本，直接构建');
    console.log('  5. 快速构建 (使用默认模板)\n');

    const versionChoice = await question("请输入选项 (1-5): ");

    let newVersion = currentVersion;
    let shouldUpdateVersion = true;
    let quickMode = false;

    if (versionChoice === "4") {
      shouldUpdateVersion = false;
      log.step('跳过版本更新，直接构建...');
    } else if (versionChoice === "5") {
      quickMode = true;
      const versionType = 'patch';
      newVersion = bumpVersion(currentVersion, versionType);
      log.info(`快速构建模式 - 新版本: ${colors.bright}${newVersion}${colors.reset}`);
    } else if (!quickMode) {
      const versionTypeMap = { "1": "patch", "2": "minor", "3": "major" };
      const versionType = versionTypeMap[versionChoice];

      if (!versionType) {
        log.error('无效的选项');
        rl.close();
        process.exit(1);
      }

      newVersion = bumpVersion(currentVersion, versionType);
      log.success(`新版本: ${colors.bright}${newVersion}${colors.reset}`);

      console.log('\n' + colors.cyan + '更新日志生成方式:' + colors.reset);
      console.log('  1. 手动输入每一条更新内容');
      console.log('  2. 使用固定模板自动生成');
      console.log('  3. 调用在线 AI 自动生成');
      console.log('  4. 预览AI生成结果后再决定\n');
      const changelogMode = await question('请输入选项 (1-4，默认 2): ');

      let changes = null;
      let aiRaw = "";
      let useAi = false;

      if (quickMode) {
        // 快速模式：使用固定模板
        changes = getDefaultChanges(versionType);
        log.step('使用固定模板生成更新日志');
      } else if (changelogMode === "1") {
        changes = { "1": [], "2": [], "3": [], "4": [] };

        log.step('请输入更新内容（每个类别输入完成后直接按回车跳过）:');
        console.log('');

        const categories = [
          { key: "1", name: "新增 (Added)" },
          { key: "2", name: "改进 (Changed)" },
          { key: "3", name: "修复 (Fixed)" },
          { key: "4", name: "删除 (Removed)" },
        ];

        for (const category of categories) {
          console.log(`\n${colors.cyan}${category.name}:${colors.reset}`);
          let i = 1;
          // eslint-disable-next-line no-constant-condition
          while (true) {
            const change = await question(`  ${i}. `);
            if (!change.trim()) break;
            changes[category.key].push(change.trim());
            log.success(`已添加: ${change.trim()}`);
            i++;
          }
        }
      } else if (changelogMode === "3" || changelogMode === "4") {
        try {
          log.step('正在调用在线 AI 生成更新日志...');
          aiRaw = await generateAiChangelog(newVersion, versionType);
          
          if (changelogMode === "4") {
            // 预览模式
            console.log('\n' + colors.cyan + '━'.repeat(60) + colors.reset);
            console.log(colors.bright + 'AI 生成的更新日志预览:' + colors.reset);
            console.log(colors.cyan + '━'.repeat(60) + colors.reset);
            console.log(aiRaw);
            console.log(colors.cyan + '━'.repeat(60) + colors.reset + '\n');
            
            const confirm = await question('是否使用此更新日志? (y/n/e，y=使用/n=使用模板/e=取消): ');
            if (confirm.toLowerCase() === 'e') {
              log.warn('构建已取消');
              rl.close();
              process.exit(0);
            } else if (confirm.toLowerCase() === 'n') {
              changes = getDefaultChanges(versionType);
              log.step('已改用固定模板');
            } else {
              useAi = true;
              log.success('已确认使用 AI 生成的更新日志');
            }
          } else {
            useAi = true;
            log.success('AI 更新日志生成成功');
          }
        } catch (e) {
          log.error(`调用在线 AI 失败: ${e?.message ?? e}`);
          const fallback = await question('是否改用固定模板继续? (y/n): ');
          if (fallback.toLowerCase() !== 'y') {
            log.warn('构建已取消');
            rl.close();
            process.exit(0);
          }
          changes = getDefaultChanges(versionType);
          log.step('已改用固定模板');
        }
      } else {
        changes = getDefaultChanges(versionType);
        log.step('使用固定模板自动生成更新日志');
      }

      let hasChanges = false;
      if (useAi) {
        hasChanges = aiRaw.trim().length > 0;
      } else {
        hasChanges = Object.values(changes ?? {}).some((arr) => arr.length > 0);
      }

      if (!hasChanges && !quickMode) {
        log.warn('没有输入任何更新内容');
        const confirm = await question('是否继续? (y/n): ');
        if (confirm.toLowerCase() !== 'y') {
          log.warn('构建已取消');
          rl.close();
          process.exit(0);
        }
      }

      log.step('正在更新版本信息...');
      updatePackageJson(newVersion);
      updateViteConfig(newVersion);
      if (hasChanges || quickMode) {
        if (useAi) {
          updateChangelogWithRaw(newVersion, aiRaw);
        } else if (changes) {
          updateChangelog(newVersion, changes);
        }
      }
      log.success('版本信息更新完成');
    }

    log.step('开始构建...');
    console.log('');
    execSync('vite build', { stdio: 'inherit' });

    const endTime = Date.now();
    const duration = ((endTime - startTime) / 1000).toFixed(2);
    
    console.log('');
    log.success(`构建完成！${
      shouldUpdateVersion ? `版本: ${colors.bright}${newVersion}${colors.reset}` : ''
    }`);
    log.info(`耗时: ${colors.dim}${duration}s${colors.reset}`);
    console.log('');

    rl.close();
  } catch (error) {
    console.log('');
    log.error(`构建失败: ${error?.message ?? error}`);
    if (error.stack) {
      console.log(colors.dim + error.stack + colors.reset);
    }
    rl.close();
    process.exit(1);
  }
}

main();
