# 咖窝子的日常记录 · 免费静态托管部署说明

本项目是**纯静态网页（PWA）**，不需要服务器和数据库，可以免费托管到 GitHub Pages 或 Gitee Pages。

- GitHub Pages：免费、无需审核、代码更新后**自动**重新发布；缺点是国内访问偏慢（必要时开代理）。
- Gitee Pages：服务器在国内、访问快；但需要**实名认证**，且免费版每次发布都要**人工审核**（几分钟～几小时），更新需手动点“更新”按钮。

> ⚠️ 重要：App 的数据存在浏览器本地（localStorage + IndexedDB 双重备份，每次增删改即时写入、切后台自动落盘，重开自动恢复）。换一个新网址 = 一个新的浏览器空间 = **会像新用户一样空白**，需要在各台设备上重新记录。这不是 bug，是纯前端应用的特点。可在「设置 → 数据保存」查看当前环境的保存状态。

---

## 一、先解压并确认文件

把 zip 解压后应得到如下结构（部署时要把**这一层的内容**传到仓库根目录，不要把外层文件夹再包一层）：

```
index.html
manifest.json
service-worker.js
icon-192.png / icon-512.png / icon-180.png / apple-touch-icon.png
css/styles.css
js/app.js
js/icons.js
.nojekyll
部署说明-README.md
```

---

## 二、部署到 GitHub Pages（推荐，无需审核）

### 第 1 步：注册账号
1. 打开 https://github.com → 点 **Sign up**。
2. 填邮箱、密码、用户名（username，全站唯一、之后会出现在网址里），完成邮箱验证。
3. 登录。

### 第 2 步：新建仓库
1. 右上角 **+** → **New repository**。
2. Repository name 填英文小写，例如 `daily-record`。
3. **必须选 Public（公开）**——免费账号只有公开仓库才能开 Pages；Private 需要付费套餐。
4. **不要**勾选 "Add a README file"。
5. 点 **Create repository**。

### 第 3 步：上传文件（二选一）

**方式 A：网页直接拖拽（最简单，适合首次部署）**
1. 进入刚建的仓库页面 → 点 **uploading an existing file**（或 Add file → Upload files）。
2. 打开解压出的 `dailylife` 文件夹，把里面的**所有文件和文件夹**（index.html、css、js、icon、sw.js、manifest 等）拖进网页上传区。
   - 拖拽后网页上会看到 css/、js/ 目录结构，index.html 在根目录，**不要**再多包一层。
3. 下方点 **Commit changes**。

**方式 B：Git 命令行（方便以后更新）**
```bash
cd 项目所在目录/dailylife
git init
git add .
git commit -m "first deploy"
git branch -M main
git remote add origin https://github.com/你的用户名/daily-record.git
git push -u origin main
```

### 第 4 步：开启 Pages 并拿到网址
1. 仓库页 → **Settings** → 左侧 **Pages**。
2. Build and deployment → Source 选 **Deploy from a branch**。
3. Branch 选 **main**，目录选 **/(root)** → **Save**。
4. 等 1～3 分钟，页面顶部出现绿色提示和网址：`https://你的用户名.github.io/daily-record/`
5. 打开该网址即可使用（首次打开会像新用户，属正常）。

### 以后如何更新
改完本地文件后：
- 网页方式：重新进入仓库 → Add file → Upload files，**用同名文件覆盖**旧文件，再 Commit。
- Git 方式：`git add . && git commit -m "update" && git push`。

GitHub 会**自动重新发布**，1 分钟左右生效。

---

## 三、部署到 Gitee Pages（国内访问快，需实名+审核）

### 第 1 步：注册 + 实名认证
1. 打开 https://gitee.com → 注册并登录。
2. 头像 → **账号设置 / 账户中心** → **实名认证**，按提示提交身份信息（审核约几小时～1 天）。
   - 未实名无法开通 Gitee Pages。

### 第 2 步：新建公开仓库
1. 右上角 **+** → **新建仓库**。
2. 仓库名称填英文，如 `daily-record`；**必须选“公开”**。
3. 不要勾选“使用 Readme 初始化”，点创建。

### 第 3 步：上传文件（二选一）
- 网页方式：仓库页 → **+** / **文件** → **上传文件**，把 `dailylife` 里的所有文件拖入（同样注意目录层级），提交。
- Git 方式（Gitee 默认分支通常是 master）：
```bash
cd 项目所在目录/dailylife
git init
git add .
git commit -m "首次部署"
git remote add origin https://gitee.com/你的用户名/daily-record.git
git push -u origin master
```

### 第 4 步：开启 Gitee Pages
1. 进入仓库 → 顶部/左侧 **服务** → **Gitee Pages**。
2. 首次使用先阅读并同意《Gitee Pages 服务条款》。
3. 部署分支选 `master`（或你推送的分支），部署目录填 `/`，点 **启动部署**。
4. 进入**人工审核**，等待几分钟～几小时；通过后页面显示网址：`https://你的用户名.gitee.io/daily-record/`
5. 打开网址使用。

### 以后如何更新
每次推送/上传新文件后，都要回到 **服务 → Gitee Pages** 页面点一次 **“更新”**，并再次等待审核，线上才会变成新版。

> 备注：免费版页面底部会有 Gitee 角标；自定义域名需要国内备案，通常没必要，直接用 gitee.io 即可。

---

## 四、常见问题 FAQ

| 现象 | 原因与解决 |
| --- | --- |
| 打开 404 | ① 确认仓库是 **Public**；② 确认 index.html 在仓库**根目录**；③ GitHub 首次发布等 1～3 分钟；Gitee 可能还在审核。 |
| 页面空白或样式丢失 | 上传时目录层级错了——css/、js/ 必须和 index.html 同级，别包外层文件夹。重新覆盖上传即可。 |
| 打开后像新用户、记录全空 | 换网址 = 新的浏览器存储空间，属正常现象。旧网址的数据仍在旧网址那边。 |
| 改版后线上还是旧的 | 本项目已带版本号（?v=19）+ 网络优先 Service Worker，一般不会缓存旧版；仍不生效就强刷（Ctrl/Cmd+Shift+R）或清一次站点数据。 |
| 用了几天后，只有前两天的记录在，后面的记录没了 | **v19 已修复**：旧版把图片以 base64 直接塞进 localStorage（上限约 5MB），存几张照片就写满，之后的新记录只能进 IndexedDB，而旧版启动只读 localStorage，于是"只看到前两天、后面的丢失"。v19 起：① 图片改为存进 IndexedDB 大容量图片库，记录里只留短引用，localStorage 体积恒定、永不写满；② 启动时会把 IndexedDB 里"看不见"的记录自动合并回来（按 id 去重，不覆盖现有数据）；③ 老数据自动迁移（内嵌大图搬进图片库）并弹出"已从自动备份找回 N 条记录"提示。**部署 v19 后直接打开即可，历史记录会自动找回。** |
| 手机上无法安装/离线 | GitHub / Gitee Pages 都自动带 HTTPS，满足 PWA 条件；用手机浏览器打开后按顶部横幅“添加到主屏幕”。 |
| 在小码盒等本地预览 App 里打开，记录不保存 | 小码盒属“本地文件预览”工具（非 HTTPS 网页）。此类环境经常禁止 localStorage/IndexedDB 或每次启动清空，**任何网页代码都无法保证跨启动保存**。App 启动时会自检并在首页弹红条、在「设置 → 数据保存」显示状态：若显示“✗ 本环境无法保存”即代表此环境不支持持久化，请改用浏览器打开部署后的 HTTPS 网址（GitHub/Gitee Pages）长期使用；临时记录请用「数据备份」导出 JSON 保管。若显示“备用存储模式”，说明常规存储被禁但已用 IndexedDB 兜底，仍可保存、重开自动恢复。 |
| Gitee Pages 提示开通不了 | 先完成实名认证；若提示需要升级 Pro，可改用 GitHub Pages 方案。 |

---

## 五、小贴士

- 想在国内也能稳定访问，优先 Gitee；不介意速度、想要“免审核+自动更新”，优先 GitHub。
- 两个平台可以同时部署，互不影响，数据各自独立。
- 若之后有较大改版，别忘了同步更新 `sw.js` 里的版本号（CACHE 名称）和 HTML 里的 `?v=` 版本，避免老缓存干扰。
