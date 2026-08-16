# 汪韵 · 互动作品集 Portfolio

一个纯静态的个人作品集网站，全部由 HTML + CSS + 少量 JS 编写，**不需要任何后端服务器**，任意浏览器都能直接打开。

## 一、目录结构

```
portfolio-demo/
├── index.html          # 首页（About / Experience / Projects / Life / Resume & Contact）
├── styles.css          # 全站样式（颜色、字体、卡片、hero 等）
├── script.js           # 轻量交互（几乎不含业务逻辑）
├── resume.html         # 备用一页版简历网页
├── assets/             # 图片、logo、PDF 简历、视频等资源
│   ├── portrait.jpg            # 首页照片
│   ├── bytedance.png / kantar.png / xiaohongshu.png / syrc.png   # 企业 logo
│   ├── proj-wuyu.jpg / proj-gongyi.jpg / proj-videos.jpg          # 项目封面
│   └── wangyun-resume.pdf                                         # 一页简历 PDF
├── experience/         # Experience 详情页（4 段实习各一份）
│   ├── bytedance.html
│   ├── kantar.html
│   ├── xiaohongshu.html
│   └── syrc.html
├── projects/           # Projects 详情页
│   ├── wuyu.html
│   ├── gongyi.html
│   └── videos.html
└── life/               # Life 详情页
    ├── platforms.html
    ├── photography.html
    ├── sports.html
    └── inputs.html
```

## 二、本地预览

**方法 1：直接双击打开**
- 找到 `index.html`，右键 → 用 Chrome / Edge / Safari 打开即可。

**方法 2：用 VS Code 的 Live Server 插件（推荐）**
- 在 VS Code 里安装 `Live Server` 插件 → 右键 `index.html` → `Open with Live Server`，改动会自动刷新。

**方法 3：命令行起一个静态服务**
```bash
cd portfolio-demo
python3 -m http.server 8080
# 打开 http://localhost:8080
```

## 三、常见修改指南

### 1. 换首页照片
- 把新照片命名为 `portrait.jpg`，替换 `assets/portrait.jpg` 即可。
- 如果照片方向或裁剪不合适，可在 `styles.css` 搜 `.hero-photo`，调整 `object-position` 或 `width`。

### 2. 换企业 logo
- 直接替换 `assets/` 下的 `bytedance.png` / `kantar.png` / `xiaohongshu.png` / `syrc.png`。

### 3. 换项目封面
- 替换 `assets/proj-wuyu.jpg`（吴语）、`proj-gongyi.jpg`（助学）、`proj-videos.jpg`（视频创意）。
- 想改遮罩深浅：`styles.css` 搜 `.proj-cover:after`，修改 `rgba(0,0,0,X)` 里的数值。

### 4. 换一页简历 PDF
- 把新 PDF 命名为 `wangyun-resume.pdf`，替换 `assets/wangyun-resume.pdf`。
- 首页 Part 05 右侧卡片会自动指向这个新文件。

### 5. 改文案
- 首页所有文字都在 `index.html` 里，`Ctrl + F` 搜关键词直接改就行。
- 详情页在 `experience/`、`projects/`、`life/` 子目录，每个 `.html` 一段独立内容。

### 6. 加一个新的详情页
- 复制一个已有的 `experience/xxx.html` 或 `life/xxx.html` 作为模板。
- 改标题、正文，然后回到 `index.html`，把对应卡片的 `href` 指到新文件即可。

### 7. 改颜色 / 字体
- 全站主色调、边框、字体大小都集中在 `styles.css` 顶部的 `:root { --xxx: ... }` 变量里，改一个变量就能全站生效。

## 四、发布到公开网页（免费方案）

作品集是纯静态站点，任何静态托管平台都能一键部署。**推荐两种，几分钟就能出一个 https 外链。**

### 方案 A：Netlify Drop（最简单，无需登录）
1. 打开 [https://app.netlify.com/drop](https://app.netlify.com/drop)
2. 把 `portfolio-demo` 文件夹整个拖进网页
3. 拖完后自动生成一个类似 `https://xxx-xxx.netlify.app` 的公开外链，可以直接分享
4. 注册 Netlify 账号可以拿到永久链接和自定义域名

### 方案 B：Vercel（推荐，支持一键更新）
1. 访问 [https://vercel.com](https://vercel.com)，用 GitHub 账号登录
2. 点 `Add New Project` → `Import` → 上传 `portfolio-demo` 文件夹或链接 GitHub 仓库
3. 一键部署，得到形如 `https://xxx.vercel.app` 的外链
4. 之后每次改代码 `git push` 就会自动重新发布，不用重复上传

### 方案 C：GitHub Pages（免费 + 永久）
1. 在 GitHub 建一个仓库，比如 `wangyun-portfolio`
2. 把 `portfolio-demo` 里所有文件推上去
3. Settings → Pages → 选 `main` 分支 → 保存
4. 几分钟后可用 `https://<你的用户名>.github.io/wangyun-portfolio/` 访问

### 方案 D：想要更专业
可以买一个域名（阿里云 / Namecheap 都可以），在 Netlify / Vercel 里绑定，就是 `https://wangyun.xyz` 这种个人域名。

## 五、通用建议

- **每次改完文件先在本地开一个 `python3 -m http.server` 看看**，确认没问题再上传。
- **想版本回滚**：这个项目已经初始化了 git，`git log` 能看到每次修改，`git checkout` 可以回到任意历史版本。
- **想改动大结构**（比如加 Part 06 / 新板块），可参考现有的 section 结构复制粘贴，样式类保持一致即可。

有任何具体想改的地方，只要在 `index.html` 里定位到那段 HTML，跟一段简单的 CSS 类名，几乎都能一分钟内完成。
