/**
 * deploy.js — 一键发布脚本
 *
 * 流程：
 *   1. npm run build        （根目录构建，输出到 site/）
 *   2. 根仓库 git add/commit/push   （提交 .md 源文件 + scripts）
 *   3. site 仓库 git add/commit/push（提交 HTML 产物，触发 GitHub Pages 部署）
 *
 * 用法：npm run deploy
 *
 * commit 消息自动生成，含日期 + 文章数。
 * 任一步失败立即中止；无变动时跳过该仓库的提交。
 */

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

const ROOT = path.join(__dirname, '..');
const SITE_DIR = path.join(ROOT, 'site');
const ARTICLES_DIR = path.join(ROOT, 'cn', '网站文章');

// ── 辅助 ──

function run(cmd, opts = {}) {
  console.log(`  $ ${cmd}`);
  return execSync(cmd, { stdio: 'pipe', encoding: 'utf-8', cwd: ROOT, ...opts });
}

function runInherited(cmd, opts = {}) {
  // 让子进程直接继承 stdio，把 build 的彩色输出透传出来
  execSync(cmd, { stdio: 'inherit', cwd: ROOT, ...opts });
}

function hasChanges(repoDir) {
  const out = execSync('git status --porcelain', {
    cwd: repoDir, encoding: 'utf-8', stdio: 'pipe',
  });
  return out.trim().length > 0;
}

function today() {
  // 不用 Date 的本地方法，直接从系统取，避免 OpenWolf 脚本环境限制
  return new Date().toISOString().slice(0, 10);
}

function countArticles() {
  try {
    return fs.readdirSync(ARTICLES_DIR).filter(f => f.endsWith('.md')).length;
  } catch {
    return 0;
  }
}

// ── 主流程 ──

function main() {
  const date = today();
  const articleCount = countArticles();

  console.log(`\n🚀 部署开始 · ${date} · ${articleCount} 篇文章\n`);

  // 1. 构建
  console.log('🔨 构建中...');
  try {
    runInherited('npm run build');
  } catch {
    console.error('\n❌ 构建失败，中止部署。');
    process.exit(1);
  }
  console.log('');

  // 2. 根仓库
  console.log('📦 提交根仓库（answer-engine-optimization）...');
  if (hasChanges(ROOT)) {
    const msg = `feat: 发布文章 ${date} (${articleCount} 篇)`;
    execSync('git add .', { cwd: ROOT, stdio: 'inherit' });
    execSync(`git commit -m "${msg}"`, { cwd: ROOT, stdio: 'inherit' });
    execSync('git push', { cwd: ROOT, stdio: 'inherit' });
    console.log(`  ✅ 根仓库已提交并推送：${msg}`);
  } else {
    console.log('  ⏭️  根仓库无变动，跳过。');
  }
  console.log('');

  // 3. site 仓库（独立 GitHub Pages 仓库）
  console.log('🚀 部署 site（jaykaai.github.io → GitHub Pages）...');
  if (!fs.existsSync(path.join(SITE_DIR, '.git'))) {
    console.error(`\n❌ ${SITE_DIR} 不是 git 仓库，跳过 site 部署。`);
    process.exit(1);
  }

  if (hasChanges(SITE_DIR)) {
    const siteMsg = `deploy: ${date} 文章更新`;
    execSync('git add .', { cwd: SITE_DIR, stdio: 'inherit' });
    execSync(`git commit -m "${siteMsg}"`, { cwd: SITE_DIR, stdio: 'inherit' });
    execSync('git push', { cwd: SITE_DIR, stdio: 'inherit' });
    console.log(`  ✅ site 已提交并推送：${siteMsg}`);
  } else {
    console.log('  ⏭️  site 无变动，跳过。');
  }

  console.log('\n🎉 部署完成！\n');
}

main();
