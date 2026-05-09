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
      baseURL: cfg.baseURL || "https://api.openai.com/v1",
      apiKey: cfg.apiKey || "",
      model: cfg.model || "gpt-4o-mini",
    };
  } catch {
    return {
      baseURL: "https://api.openai.com/v1",
      apiKey: "",
      model: "gpt-4o-mini",
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
  let gitUncommitted = "";
  let changelogPreview = "";

  // 查找上一次版本更新的提交（package.json 中 version 字段变更）
  let lastVersionCommit = "";
  try {
    lastVersionCommit = execSync(
      'git log --all -1 --format="%H" -- package.json',
      { encoding: "utf-8", stdio: ["ignore", "pipe", "ignore"] },
    ).trim();
  } catch {}

  // 获取从上次版本更新到 HEAD 的所有提交
  try {
    if (lastVersionCommit) {
      gitSummary = execSync(
        `git log ${lastVersionCommit}..HEAD --pretty=format:"%h %s"`,
        { encoding: "utf-8", stdio: ["ignore", "pipe", "ignore"] },
      );
    }
    if (!gitSummary) {
      // 回退：最近 20 条提交
      gitSummary = execSync('git log -20 --pretty=format:"%h %s"', {
        encoding: "utf-8",
        stdio: ["ignore", "pipe", "ignore"],
      });
    }
  } catch {}

  // 获取上次版本更新到 HEAD 的 diff 统计
  try {
    if (lastVersionCommit) {
      gitDiffStat = execSync(`git diff --stat ${lastVersionCommit}..HEAD`, {
        encoding: "utf-8",
        stdio: ["ignore", "pipe", "ignore"],
      });
    }
  } catch {}

  // 获取当前本地未提交的变更
  try {
    gitUncommitted = execSync("git diff --stat", {
      encoding: "utf-8",
      stdio: ["ignore", "pipe", "ignore"],
    });
  } catch {}

  try {
    const changelog = readFileSync("./CHANGELOG.md", "utf-8");
    // 只截取前一部分作为示例，防止内容过长
    changelogPreview = changelog.slice(0, 2000);
  } catch {}

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
        changelogPreview
          ? `以下是当前项目已有的 CHANGELOG 示例片段（供你参考风格，无需照搬版本号）:\n${changelogPreview}`
          : "",
        gitSummary ? `上次版本更新以来的提交记录:\n${gitSummary}` : "",
        gitDiffStat ? `上次版本更新以来的 diff 统计:\n${gitDiffStat}` : "",
        gitUncommitted ? `当前本地未提交的变更:\n${gitUncommitted}` : "",
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
    console.log('  4. 不更新版本，直接构建\n');

    const versionChoice = await question("请输入选项 (1-4): ");

    let newVersion = currentVersion;
    let shouldUpdateVersion = true;

    if (versionChoice === "4") {
      shouldUpdateVersion = false;
      log.step('跳过版本更新，直接构建...');
    } else {
      const versionTypeMap = { "1": "patch", "2": "minor", "3": "major" };
      const versionType = versionTypeMap[versionChoice];

      if (!versionType) {
        log.error('无效的选项');
        rl.close();
        process.exit(1);
      }

      newVersion = bumpVersion(currentVersion, versionType);
      log.success(`新版本: ${colors.bright}${newVersion}${colors.reset}`);

      let aiRaw = "";
      try {
        log.step('正在调用在线 AI 生成更新日志...');
        aiRaw = await generateAiChangelog(newVersion, versionType);
        log.success('AI 更新日志生成成功');
      } catch (e) {
        log.error(`调用在线 AI 失败: ${e?.message ?? e}`);
        const continueAnyway = await question('是否跳过更新日志继续构建? (y/n): ');
        if (continueAnyway.toLowerCase() !== 'y') {
          log.warn('构建已取消');
          rl.close();
          process.exit(0);
        }
      }

      log.step('正在更新版本信息...');
      updatePackageJson(newVersion);
      updateViteConfig(newVersion);
      if (aiRaw.trim().length > 0) {
        updateChangelogWithRaw(newVersion, aiRaw);
      }
      log.success('版本信息更新完成');
    }

    log.step('开始构建...');
    console.log('');
    execSync('vite build', { stdio: 'inherit' });
    execSync('node scripts/obfuscate-userscript.js', { stdio: 'inherit' });

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
