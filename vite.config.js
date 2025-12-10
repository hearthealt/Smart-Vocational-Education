import { defineConfig } from 'vite';
import monkey from 'vite-plugin-monkey';

export default defineConfig({
    plugins: [
        monkey({
            entry: 'src/main.ts',
            userscript: {
                name: '智慧职教全能助手',
                namespace: 'http://tampermonkey.net/',
                version: '2.0.1',
                description: '智慧职教MOOC学习助手：仅支持智慧职教MOOC平台，集成自动学习和AI智能答题功能',
                author: 'caokun',
                license: 'MIT',
                icon: 'https://www.icve.com.cn/favicon.ico',
                match: [
                    'https://*.icve.com.cn/excellent-study/*',
                    'https://*.icve.com.cn/preview-exam/*'
                ],
                grant: [
                    'GM_xmlhttpRequest',
                    'GM_setValue',
                    'GM_getValue'
                ],
                connect: ['*'],
                'run-at': 'document-idle',
                updateURL: 'https://raw.githubusercontent.com/hearthealt/Smart-Vocational-Education/master/dist/icve-helper.user.js',
                downloadURL: 'https://raw.githubusercontent.com/hearthealt/Smart-Vocational-Education/master/dist/icve-helper.user.js',
                homepageURL: 'https://github.com/hearthealt/Smart-Vocational-Education',
                supportURL: 'https://github.com/hearthealt/Smart-Vocational-Education/issues',
                note: 'https://raw.githubusercontent.com/hearthealt/Smart-Vocational-Education/master/README.md'
            },
            build: {
                fileName: 'icve-helper.user.js',
                externalGlobals: {}
            }
        })
    ],
    build: {
        outDir: 'dist',
        minify: false, // 用户脚本通常不压缩以便调试
        sourcemap: false
    }
});
