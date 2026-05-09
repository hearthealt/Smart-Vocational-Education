import { readFileSync, statSync, writeFileSync } from 'fs';
import JavaScriptObfuscator from 'javascript-obfuscator';

const targetFile = process.argv[2] || 'dist/icve-helper.user.js';
const source = readFileSync(targetFile, 'utf-8');
const headerMatch = source.match(/^\/\/ ==UserScript==[\s\S]*?\/\/ ==\/UserScript==\r?\n?/);

if (!headerMatch) {
  throw new Error(`未找到 UserScript 头部，已停止混淆: ${targetFile}`);
}

const header = headerMatch[0].trimEnd();
const body = source.slice(headerMatch[0].length).trim();

if (!body) {
  throw new Error(`UserScript 正文为空，已停止混淆: ${targetFile}`);
}

const beforeSize = statSync(targetFile).size;
const result = JavaScriptObfuscator.obfuscate(body, {
  compact: false,
  controlFlowFlattening: true,
  controlFlowFlatteningThreshold: 0.55,
  deadCodeInjection: true,
  deadCodeInjectionThreshold: 0.18,
  identifierNamesGenerator: 'hexadecimal',
  numbersToExpressions: true,
  renameGlobals: false,
  selfDefending: false,
  simplify: true,
  splitStrings: true,
  splitStringsChunkLength: 10,
  stringArray: true,
  stringArrayCallsTransform: true,
  stringArrayCallsTransformThreshold: 0.5,
  stringArrayEncoding: ['base64'],
  stringArrayRotate: true,
  stringArrayShuffle: true,
  stringArrayThreshold: 1,
  stringArrayWrappersChainedCalls: true,
  stringArrayWrappersCount: 2,
  stringArrayWrappersParametersMaxCount: 4,
  transformObjectKeys: true,
  unicodeEscapeSequence: true,
  target: 'browser'
});

writeFileSync(targetFile, `${header}\n\n${result.getObfuscatedCode()}\n`);

const afterSize = statSync(targetFile).size;
console.log(`obfuscated ${targetFile}: ${beforeSize} -> ${afterSize} bytes`);
