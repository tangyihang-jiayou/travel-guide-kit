# Travel Guide Kit

一个用来制作竖屏旅行攻略讲解页的静态模板仓库。

核心原则：

- 地图先行：每套攻略先用地图建立路线框架。
- 图片为主：一页一张原图，文字只做录制时的轻提示。
- 本地可用：不用构建工具，直接打开每个 guide 的 `index.html` 即可录制。
- 可复用：后续新增城市时复制 `guides/_template`，替换素材和 `guide.config.js`。

## 仓库信息

- GitHub owner: `tangyihang-jiayou`
- Repository: `travel-guide-kit`
- Visibility: public
- Planned URL: `https://github.com/tangyihang-jiayou/travel-guide-kit`

## 快速预览

打开巴黎示例：

```text
guides/paris/index.html
```

跳到指定页：

```text
guides/paris/index.html?slide=20
guides/paris/index.html#20
```

翻页方式：

- 点击右半屏：下一页
- 点击左半屏：上一页
- 键盘右箭头 / 空格：下一页
- 键盘左箭头：上一页

## 新建一套攻略

```bash
npm run new -- kyoto "京都松弛散步指南"
```

然后把素材放进：

```text
guides/kyoto/assets/maps/
guides/kyoto/assets/photos/
guides/kyoto/assets/web/
```

最后编辑：

```text
guides/kyoto/guide.config.js
```

## 检查内容

```bash
npm run check -- guides/paris
```

这个检查会确认 `guide.config.js` 存在、每页有标题和图片、图片文件路径能找到。

## 目录结构

```text
travel-guide-kit/
  guides/
    _template/              # 新地点复制这里
    paris/                  # 巴黎示例内容
      assets/
        maps/               # 地图、路线图、手写地图
        photos/             # 原图、旅行照片
        web/                # 网页截图、资料截图
      guide.config.js       # 页面顺序、标题、口播提示、素材引用
      index.html            # 打开这个录制
  templates/
    route-map-gallery/
      app.js                # 通用翻页和渲染逻辑
      styles.css            # 通用地图 App 风格视觉
  docs/
    ARCHITECTURE.md
    CONTENT_GUIDE.md
  scripts/
    check-guide.mjs
    new-guide.mjs
```

## 内容约定

每页 slide 至少包含：

```js
{
  section: "03 / 铁塔",
  src: "photos/image-1.jpg",
  title: "铁塔留给傍晚",
  text: "这段是给自己看的口播提示，默认不会显示。"
}
```

地图页加上：

```js
kind: "map"
```

网页资料建议先保存截图，放到 `assets/web/`，再在 `sources` 里保留原链接。
