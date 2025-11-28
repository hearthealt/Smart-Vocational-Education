import { readFileSync, writeFileSync } from 'fs';
import { execSync } from 'child_process';
import readline from 'readline';

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

// 读取当前版本
function getCurrentVersion() {
    const packageJson = JSON.parse(readFileSync('./package.json', 'utf-8'));
    return packageJson.version;
}

// 更新版本号
function bumpVersion(version, type) {
    const parts = version.split('.').map(Number);
    switch (type) {
        case 'major':
            parts[0]++;
            parts[1] = 0;
            parts[2] = 0;
            break;
        case 'minor':
            parts[1]++;
            parts[2] = 0;
            break;
        case 'patch':
            parts[2]++;
            break;
    }
    return parts.join('.');
}

// 更新 package.json
function updatePackageJson(newVersion) {
    const packageJson = JSON.parse(readFileSync('./package.json', 'utf-8'));
    packageJson.version = newVersion;
    writeFileSync('./package.json', JSON.stringify(packageJson, null, 2) + '\n');
}

// 更新 vite.config.js
function updateViteConfig(newVersion) {
    let viteConfig = readFileSync('./vite.config.js', 'utf-8');
    viteConfig = viteConfig.replace(
        /version:\s*['"][\d.]+['"]/,
        `version: '${newVersion}'`
    );
    writeFileSync('./vite.config.js', viteConfig);
}

// 更新 CHANGELOG.md
function updateChangelog(newVersion, changeType, changes) {
    const date = new Date().toISOString().split('T')[0];
    const changelog = readFileSync('./CHANGELOG.md', 'utf-8');

    // 构建新的更新日志条目
    let newEntry = `## [${newVersion}] - ${date}\n\n`;

    const categoryMap = {
        '1': { name: '新增', key: 'Added' },
        '2': { name: '改进', key: 'Changed' },
        '3': { name: '修复', key: 'Fixed' },
        '4': { name: '删除', key: 'Removed' }
    };

    for (const [category, items] of Object.entries(changes)) {
        if (items.length > 0) {
            const categoryName = categoryMap[category].name;
            newEntry += `### ${categoryName}\n`;
            items.forEach(item => {
                newEntry += `- ${item}\n`;
            });
            newEntry += '\n';
        }
    }

    // 在第一个版本标题之前插入新条目
    const versionRegex = /## \[[\d.]+\]/;
    const match = changelog.match(versionRegex);

    if (match) {
        const insertIndex = changelog.indexOf(match[0]);
        const updatedChangelog =
            changelog.slice(0, insertIndex) +
            newEntry +
            changelog.slice(insertIndex);
        writeFileSync('./CHANGELOG.md', updatedChangelog);
    } else {
        // 如果找不到现有版本，追加到文件末尾
        writeFileSync('./CHANGELOG.md', changelog + '\n' + newEntry);
    }
}

// 询问问题的辅助函数
function question(prompt) {
    return new Promise((resolve) => {
        rl.question(prompt, resolve);
    });
}

// 主函数
async function main() {
    try {
        const currentVersion = getCurrentVersion();
        console.log(`\n当前版本: ${currentVersion}\n`);

        // 选择版本更新类型
        console.log('请选择版本更新类型:');
        console.log('1. 补丁版本 (Patch) - 修复bug');
        console.log('2. 小版本 (Minor) - 新增功能');
        console.log('3. 大版本 (Major) - 重大更新');
        console.log('4. 不更新版本，直接构建\n');

        const versionChoice = await question('请输入选项 (1-4): ');

        let newVersion = currentVersion;
        let shouldUpdateVersion = true;

        if (versionChoice === '4') {
            shouldUpdateVersion = false;
            console.log('\n跳过版本更新，直接构建...\n');
        } else {
            const versionTypeMap = { '1': 'patch', '2': 'minor', '3': 'major' };
            const versionType = versionTypeMap[versionChoice];

            if (!versionType) {
                console.log('无效的选项！');
                rl.close();
                process.exit(1);
            }

            newVersion = bumpVersion(currentVersion, versionType);
            console.log(`\n新版本: ${newVersion}\n`);

            // 收集更新日志
            const changes = { '1': [], '2': [], '3': [], '4': [] };

            console.log('请输入更新内容 (每个类别输入完后直接按回车跳过):');
            console.log('');

            const categories = [
                { key: '1', name: '新增 (Added)' },
                { key: '2', name: '改进 (Changed)' },
                { key: '3', name: '修复 (Fixed)' },
                { key: '4', name: '删除 (Removed)' }
            ];

            for (const category of categories) {
                console.log(`\n${category.name}:`);
                let i = 1;
                while (true) {
                    const change = await question(`  ${i}. `);
                    if (!change.trim()) break;
                    changes[category.key].push(change.trim());
                    i++;
                }
            }

            // 检查是否至少有一条更新内容
            const hasChanges = Object.values(changes).some(arr => arr.length > 0);
            if (!hasChanges) {
                console.log('\n警告: 没有输入任何更新内容！');
                const confirm = await question('是否继续? (y/n): ');
                if (confirm.toLowerCase() !== 'y') {
                    console.log('构建已取消');
                    rl.close();
                    process.exit(0);
                }
            }

            // 更新文件
            console.log('\n正在更新版本信息...');
            updatePackageJson(newVersion);
            updateViteConfig(newVersion);
            if (hasChanges) {
                updateChangelog(newVersion, versionType, changes);
            }
            console.log('版本信息更新完成！');
        }

        // 执行构建
        console.log('\n开始构建...\n');
        execSync('vite build', { stdio: 'inherit' });

        console.log(`\n✓ 构建完成！${shouldUpdateVersion ? `版本: ${newVersion}` : ''}\n`);

        rl.close();
    } catch (error) {
        console.error('构建失败:', error.message);
        rl.close();
        process.exit(1);
    }
}

main();
