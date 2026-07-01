# Architecture

这套仓库分成三层：内容层、模板层、工具层。

## 1. 内容层：`guides/<slug>/`

每个地点一套独立内容：

```text
guides/paris/
  index.html
  vertical.html
  guide.config.js
  assets/
    maps/
    photos/
    stickers/
    web/
```

`guide.config.js` 是唯一需要频繁编辑的文件。它定义：

- `meta`: 城市、标题、作者标识
- `assetsBase`: 素材根目录
- `sources`: 网页来源、参考资料
- `slides`: 页面顺序、图片路径、页签标题、口播提示

设计上让口播提示和视觉呈现分离：`text`、`note`、`tag` 可以保留给讲解者，但模板默认只显示短标题。

## 2. 模板层：`templates/`

模板层只处理共用视觉和交互，内容仍然全部来自 `guide.config.js`。

`templates/route-map-gallery/` 是地图 App 版：

- `styles.css`: 9:16 竖屏画布、地图导航 UI、路线卡、照片适配
- `app.js`: 读取 `window.TRAVEL_GUIDE`，渲染 slides，处理翻页和跳页

`templates/vertical-caption-gallery/` 是竖屏录制版：

- `styles.css`: 原图/地图主视觉、小号提示区、轻地图纹理
- `app.js`: 读取同一套 slides，按原图比例显示素材，自动适配横图/竖图/方图

这版是内容画布，不仿任何平台 App 界面；模板不会在原图上叠加标题条或评论。

模板不关心具体城市，也不写死巴黎路径。一个地点可以同时拥有多个 HTML 入口，共用同一份内容数据。

### 城市兼容约定

路径和显示名分开：

- `slug`: 英文路径，例如 `istanbul`、`tokyo-2026`，只用于文件夹和 URL。
- `meta.city`: 画面和口播里的城市显示名，例如 `伊斯坦布尔`。
- `meta.title`: 这套攻略的完整标题，例如 `伊斯坦布尔松弛闲逛指南`。

新增城市时不要把标题、城市名、文件夹名混在一起。这样公开仓库、GitHub Pages、本地录制都稳定。

## 3. 工具层：`scripts/`

- `new-guide.mjs`: 从 `_template` 复制新地点目录
- `check-guide.mjs`: 检查配置、素材路径、基础字段

工具层无第三方依赖，方便在任何机器上直接运行。

## 4. 素材策略

建议每个地点只提交真正使用的素材：

- 地图：JPG/PNG，尽量 9:16 或接近竖屏可读
- 照片：保留原图比例，模板不强裁
- 网页：保存截图到 `assets/web/`，原链接放到 `sources`
- 贴纸：透明 PNG 放在 `assets/stickers/`，尽量不写大字，不覆盖原图主体

如果后续素材特别大，再考虑 Git LFS；目前巴黎示例不需要。

贴纸目录建议：

```text
assets/stickers/
  reusable/          # 跨城市复用的小人动作：指路、拿地图、避坑、喝咖啡
  custom/
    raw/             # 本城市生成原始图
    final/           # 最终透明贴纸，供 guide.config.js 引用
```

模板兼容两种贴纸：

- `sticker.src` 有值：使用透明 PNG。适合最终录制。
- `sticker.src` 为空：根据 `prop`、`mood`、`pose` 生成轻量 SVG。适合早期草稿。

因此伊斯坦布尔可以先用 SVG 快速排版，等内容顺序稳定后再替换为透明 PNG。

## 5. 发布策略

仓库可以公开。后续如需网页访问，可打开 GitHub Pages：

- Source: `main`
- Folder: `/`
- 巴黎页面路径：`/guides/paris/`

录制时仍建议本地打开 HTML，速度更稳。
