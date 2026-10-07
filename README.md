# 张泽华 · 作品集

电商在前、漫剧在后的静态作品画廊。当前 54 件作品：46 个视频、8 张图片；其中电商 37 件、漫剧 17 件。2026-10-07 新增的 25 个电商视频排在已有电商作品前面。

玉石绿 × 深梅紫；自然比例瀑布流；分类浏览；图片与视频查看器；手机适配、键盘操作与关闭后焦点返回。视频不自动播放。

## 网站

GitHub Pages： https://ze33293-sudo.github.io/zzh-creative-gallery/

这是公开展示版，不包含登录、上传、草稿或管理后台。原网站和原始作品不受影响。媒体、封面和字体随站点托管，不依赖原网站。

## 本地运行

需要 Node.js 22.13 或更新版本。

```sh
npm ci
npm run build
npm run preview
```

预览地址：`http://127.0.0.1:4178/zzh-creative-gallery/`。

## 添加或修改作品

1. 把已确认公开的展示副本放入 `public/media/`，封面放入 `public/posters/`。使用英文数字文件名。
2. 修改 `src/data/works.json`：填写标题、分类、类型、尺寸、时长与相对路径。按电商、漫剧排列，`sortOrder` 从 1 连续递增。
3. 运行 `npm run build` 和本地预览，检查封面、声音、比例、播放与进度条。
4. 提交到 `main`；GitHub Actions 会检查、构建并发布。发布失败时在仓库 Actions 查看原因。

也可以继续让 Codex 帮助更新。视频建议 H.264 / AAC MP4，保留无声原片。仓库单文件必须小于 100 MiB；不要放入桌面原始大文件、个人资料、私密草稿或凭据。

初始迁移工具：`node scripts/import-media.mjs <verified-manifest.json>`，只导入清单中的已验证展示副本。该清单不进入仓库；公开记录不含本机绝对路径。

## 发布

仓库 Settings → Pages 选择 GitHub Actions。固定项目路径为 `/zzh-creative-gallery/`，改仓库名时同步修改 `vite.config.ts`。发布只上传构建后的 `dist/`，不上传开发文档与源文件。

## 素材来源

作品由站点所有者提供并确认公开；视频封面为对应视频真实画面，图片为展示副本。未添加概念产品截图或虚构商业成果。作品版权归各自权利人，仓库公开不代表授权他人再使用作品。
