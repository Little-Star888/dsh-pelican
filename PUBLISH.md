# dsh-pelican 发布手册

鹈鹕插件的源码包（bundle 形态）在 `L:\Users\GXX\Desktop\dsh\dsh-pelican\`。
本机已经用 `dsh plugin --profile web add ./dsh-pelican` 装进 web profile 并验证通过。

---

## 第 1 步：本地安装（已完成 ✅）

```bash
dsh plugin --profile web add ./dsh-pelican
```

已验证：
- `L:\Users\GXX\.dsh\profiles\web\package.json` 的 dependencies 与 `dsh.profile.bundles` 都出现 `dsh-pelican`
- `node_modules\dsh-pelican` 是 Junction，指向工作区源码，改源码即时生效
- profile 的手动挂载行已移除，靠包自带 `cordis.patch.yml` 挂载，无双挂载

> 注意：装的是 `link:` 到本机路径。换机器/给别人用时，请改用下面的 npm 或 GitHub 安装。

## 第 2 步：发布到 npm（裸名安装用）

需要先登录（我无法替你登录）：

```bash
cd L:\Users\GXX\Desktop\dsh\dsh-pelican
npm login        # 输入 npm 账号（需要邮箱验证）
npm publish      # 发布 dsh-pelican@0.1.0
```

发布后任何人可装：

```bash
dsh plugin --profile web add dsh-pelican
```

已用 `npm publish --dry-run` 验证包内容（6 个文件：LICENSE / README.md / cordis.patch.yml / lib/index.js / lib/client.js / package.json）。

可选增强：给 package.json 补 `repository` 与 `author` 字段再发布（README 已含说明）。

## 第 3 步：公开 GitHub 仓库（市场投稿的前提，也是 github: 安装路径）

dsh-market 的 `dsh plugin add` 和市场条目都要求一个公开 GitHub 仓库：

1. 在 GitHub 新建仓库 `dsh-pelican`（公开）
2. 把 `L:\Users\GXX\Desktop\dsh\dsh-pelican\` 内容推上去（≥10 commits、仓库满 1 天，CI 自动检查）
3. 仓库加 `dsh-plugin` topic
4. 之后可这样装（可选）：

```bash
dsh plugin --profile web add github:<owner>/dsh-pelican
```

## 第 4 步：提交市场清单（GUI 市场页可搜到）

投稿到 `https://github.com/awesome-dsh-plugin/awesome-dsh-plugin`（生成 awesome-dsh-plugin.com，dsh-market 的 plugins.json 也来自它）：

1. Fork 该仓库
2. 新增一个文件 `data/plugins/<你的GitHub用户名>__dsh-pelican.yml`（内容见 `market-entry.yml`，把 `<owner>` 换成你的用户名）
3. 重新生成 README 并提交：

```bash
npm ci
node scripts/generate-readme.mjs
```

4. 开 PR（只动你自己的那条；README 由脚本生成，别手改）
5. 合并后，GUI 市场页就能搜到，`install` 显示 `dsh plugin --profile web add dsh-pelican`

> 描述必须属实（会被维护者核对源码），分类选不准没事，维护者会改。
