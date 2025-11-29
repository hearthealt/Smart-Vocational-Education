import { readFileSync, writeFileSync } from "fs";
import { execSync } from "child_process";
import readline from "readline";
import OpenAI from "openai";

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
    const currentVersion = getCurrentVersion();
    console.log(`\n当前版本: ${currentVersion}\n`);

    console.log("请选择版本更新类型:");
    console.log("1. 补丁版本 (Patch) - 修复 bug");
    console.log("2. 小版本 (Minor) - 新增功能");
    console.log("3. 大版本 (Major) - 重大更新");
    console.log("4. 不更新版本，直接构建\n");

    const versionChoice = await question("请输入选项 (1-4): ");

    let newVersion = currentVersion;
    let shouldUpdateVersion = true;

    if (versionChoice === "4") {
      shouldUpdateVersion = false;
      console.log("\n跳过版本更新，直接构建...\n");
    } else {
      const versionTypeMap = { "1": "patch", "2": "minor", "3": "major" };
      const versionType = versionTypeMap[versionChoice];

      if (!versionType) {
        console.log("无效的选项。");
        rl.close();
        process.exit(1);
      }

      newVersion = bumpVersion(currentVersion, versionType);
      console.log(`\n新版本: ${newVersion}\n`);

      console.log("请选择更新日志方式:");
      console.log("1. 手动输入每一条更新内容");
      console.log("2. 使用固定模板自动生成");
      console.log("3. 调用在线 AI 自动生成\n");
      const changelogMode = await question("请输入选项 (1-3，默认 2): ");

      let changes = null;
      let aiRaw = "";
      let useAi = false;

      if (changelogMode === "1") {
        changes = { "1": [], "2": [], "3": [], "4": [] };

        console.log("请输入更新内容（每个类别输入完成后直接按回车跳过）:");
        console.log("");

        const categories = [
          { key: "1", name: "新增 (Added)" },
          { key: "2", name: "改进 (Changed)" },
          { key: "3", name: "修复 (Fixed)" },
          { key: "4", name: "删除 (Removed)" },
        ];

        for (const category of categories) {
          console.log(`\n${category.name}:`);
          let i = 1;
          // eslint-disable-next-line no-constant-condition
          while (true) {
            const change = await question(`  ${i}. `);
            if (!change.trim()) break;
            changes[category.key].push(change.trim());
            i++;
          }
        }
      } else if (changelogMode === "3") {
        try {
          console.log("\n正在调用在线 AI 生成更新日志...\n");
          aiRaw = await generateAiChangelog(newVersion, versionType);
          useAi = true;
        } catch (e) {
          console.error("调用在线 AI 失败:", e?.message ?? e);
          const fallback = await question("是否改用固定模板继续? (y/n): ");
          if (fallback.toLowerCase() !== "y") {
            console.log("构建已取消。");
            rl.close();
            process.exit(0);
          }
          changes = getDefaultChanges(versionType);
        }
      } else {
        changes = getDefaultChanges(versionType);
        console.log("\n已使用固定模板自动生成更新日志。\n");
      }

      let hasChanges = false;
      if (useAi) {
        hasChanges = aiRaw.trim().length > 0;
      } else {
        hasChanges = Object.values(changes ?? {}).some((arr) => arr.length > 0);
      }

      if (!hasChanges) {
        console.log("\n警告: 没有输入任何更新内容。");
        const confirm = await question("是否继续? (y/n): ");
        if (confirm.toLowerCase() !== "y") {
          console.log("构建已取消。");
          rl.close();
          process.exit(0);
        }
      }

      console.log("\n正在更新版本信息...");
      updatePackageJson(newVersion);
      updateViteConfig(newVersion);
      if (hasChanges) {
        if (useAi) {
          updateChangelogWithRaw(newVersion, aiRaw);
        } else if (changes) {
          updateChangelog(newVersion, changes);
        }
      }
      console.log("版本信息更新完成。");
    }

    console.log("\n开始构建...\n");
    execSync("vite build", { stdio: "inherit" });

    console.log(`\n构建完成。${
      shouldUpdateVersion ? `版本: ${newVersion}` : ""
    }\n`);

    rl.close();
  } catch (error) {
    console.error("构建失败:", error?.message ?? error);
    rl.close();
    process.exit(1);
  }
}

main();
