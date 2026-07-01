const p = (n) => `photos/image-${n}.jpg`;
const e = (name) => `photos/extra-${name}.jpg`;
const m = (name) => `maps/${name}`;

window.TRAVEL_GUIDE = {
  meta: {
    title: "巴黎松弛 P 人闲逛指南",
    city: "Paris",
    author: "唐一航-探索ing",
    authorBadge: "唐",
    description: "以地图为总览、以原图为主体的巴黎旅行攻略讲解稿。"
  },
  assetsBase: "./assets/",
  ui: {
    statusTime: "9:41",
    authorBadge: "唐"
  },
  sources: [],
  slides: [
    {
      kind: "map",
      section: "01 / 我的地图",
      src: m("paris-core-map.jpg"),
      title: "先从这张图开始",
      text: "经典地标、军博、铁塔、橘园、奥赛，都在这张图里。后面按这张图展开。",
      note: "先讲地图，不急着讲照片。",
      tag: "真实笔记"
    },
    {
      kind: "map",
      section: "02 / 街区地图",
      src: m("paris-neighborhood-map.jpg"),
      title: "再看这张街区图",
      text: "蒙马特、玛黑、运河边、卢浮宫周边，决定了这趟旅行的松弛感。",
      note: "这张负责解释：为什么不要只按景点清单走。",
      tag: "街区展开"
    },
    { section: "03 / 铁塔", src: e("eiffel-blue"), title: "铁塔留给傍晚", text: "不用硬上塔，远看和蓝色时刻就很够。", note: "从核心区地图展开。", tag: "傍晚" },
    { section: "04 / 水边", src: p(7), title: "水边蓝色时刻", text: "这类画面适合讲巴黎的空间感，而不是讲购票细节。", note: "顺路、慢慢看。", tag: "塞纳河" },
    { section: "05 / 雨后", src: p(8), title: "雨后咖啡馆", text: "这就是不用排队也能获得的巴黎画面。", note: "经典区可以这样讲。", tag: "街角" },
    { section: "06 / 夜色", src: p(9), title: "灯亮以后", text: "傍晚和晚上才是巴黎特别容易留下来的时段。", note: "讲氛围，不讲清单。", tag: "傍晚" },
    { section: "07 / 建筑", src: p(12), title: "路上的建筑", text: "顺手一拍也能讲城市质感。", note: "不用每张图都变成景点。", tag: "路上" },
    { section: "08 / 店面", src: p(13), title: "顺手一眼", text: "这些过路画面让视频不像攻略搬运。", note: "真实旅行感。", tag: "碎片" },
    { section: "09 / 字体", src: p(4), title: "城市字体", text: "很小的东西，但很适合作为转场和闲逛感。", note: "路上的细节。", tag: "细节" },
    { section: "10 / 荣军院", src: p(27), title: "荣军院穹顶", text: "这就是我会单独留半天的主目标。", note: "不要夹在三个景点中间赶。", tag: "一馆" },
    { section: "11 / 军博", src: p(29), title: "拿破仑墓", text: "不是普通打卡，是这趟巴黎的历史重量。", note: "这页可以慢一点讲。", tag: "半天" },
    { section: "12 / 军博", src: p(25), title: "战争宣传画", text: "从这里开始，巴黎不只是漂亮和浪漫。", note: "常规攻略里比较少展开。", tag: "历史" },
    { section: "13 / 军博", src: p(26), title: "近现代史切片", text: "这些图像很适合讲“法国视角”。", note: "保持主观，不要讲成史课。", tag: "历史" },
    { section: "14 / 军博", src: p(34), title: "国家叙事", text: "视觉冲击很强，放大讲比拼小图更有效。", note: "图自己会说话。", tag: "馆内" },
    { section: "15 / 军博", src: p(35), title: "不止浪漫", text: "这张很适合打破观众对巴黎的单一想象。", note: "历史视角。", tag: "馆内" },
    { section: "16 / 馆内", src: p(16), title: "展厅细节", text: "不用急着赶下一站，馆内细节慢慢看才有意思。", note: "认真看一个馆。", tag: "细节" },
    { section: "17 / 馆内", src: p(17), title: "雕塑", text: "审美和历史可以放在一起讲。", note: "补充画面。", tag: "细节" },
    { section: "18 / 馆内", src: p(18), title: "审美切片", text: "这类图负责补足材质和现场感。", note: "别都讲成知识点。", tag: "细节" },
    { section: "19 / 馆内", src: p(22), title: "馆里的人", text: "人和展品在一起，反而更像真实参观。", note: "这一页可以轻轻带过。", tag: "现场" },
    { section: "20 / 蒙马特", src: e("montmartre-view"), title: "雨里看巴黎醒来", text: "第二张地图展开到蒙马特：不是只拍圣心堂。", note: "讲你没睡好反而看到清晨。", tag: "清晨" },
    { section: "21 / 蒙马特", src: e("church-prayer"), title: "清晨祷告", text: "这张是现场感，不是景点机位。", note: "讲声音、天气和当时的状态。", tag: "现场" },
    { section: "22 / 蒙马特", src: p(28), title: "墓地的安静", text: "不是必去，但很能让人慢下来。", note: "讲停顿感。", tag: "慢下来" },
    { section: "23 / 蒙马特", src: p(30), title: "墓园细节", text: "墓地这段可以很短，但会让内容更独特。", note: "不要强推。", tag: "细节" },
    { section: "24 / 蒙马特", src: p(36), title: "名人墓碑", text: "它让旅行短暂变成一种思考。", note: "轻轻讲就好。", tag: "墓地" },
    { section: "25 / 蒙马特", src: p(37), title: "停下来想一会儿", text: "这张不用讲攻略，只讲当下的感觉。", note: "真实体验。", tag: "停顿" },
    { section: "26 / 住处", src: p(31), title: "窗边和沙发", text: "住处本身决定你能不能慢下来。", note: "住宿不是测评，是节奏入口。", tag: "住下来" },
    { section: "27 / 住处", src: p(32), title: "住处先让人坐下来", text: "如果住处能让人坐下来，巴黎就不会只剩赶景点。", note: "继续讲街区。", tag: "节奏" },
    { section: "28 / 街角", src: e("flowers-cafe"), title: "楼下有花和咖啡", text: "楼下能闲逛，就赢一半。", note: "从街区地图展开。", tag: "街区" },
    { section: "29 / 街角", src: p(20), title: "路上的画", text: "这些不是目的地，但会让视频更像真实旅行。", note: "顺手拍也有用。", tag: "碎片" },
    { section: "30 / 街角", src: p(5), title: "小店细节", text: "很小，但适合讲巴黎的街头审美。", note: "补充生活感。", tag: "细节" },
    { section: "31 / 面包", src: p(19), title: "面包店也要逛", text: "面包店不是配角，它就是巴黎日常的入口。", note: "图很强，可以慢一点。", tag: "生活感" },
    { section: "32 / 超市", src: p(33), title: "超市比纪念品店更像目的地", text: "这张很适合讲“旅行变成生活”。", note: "买菜也是内容。", tag: "自煮前" },
    { section: "33 / 自煮", src: p(1), title: "回民宿做一点", text: "自己做一顿，会让巴黎从餐厅变成日常。", note: "非常个人，也真实。", tag: "自煮" },
    { section: "34 / 甜点", src: p(2), title: "甜点不用复杂", text: "这一张直接讲味道和当时的状态就好。", note: "少讲道理。", tag: "吃" },
    { section: "35 / 正餐", src: p(3), title: "一顿正餐", text: "法国菜可以试，但不用追网红店。", note: "讲真实体验。", tag: "外食" },
    { section: "36 / 正餐", src: p(6), title: "炸物沙拉", text: "这种日常餐也比清单更有画面。", note: "外面吃一顿。", tag: "外食" },
    { section: "37 / 外带", src: p(10), title: "带走也可以", text: "外带、超市、面包店都算旅行内容。", note: "不用每顿都正式。", tag: "日常" },
    { section: "38 / 超市", src: p(15), title: "逛货架", text: "货架和价格也能讲出生活感。", note: "补充自煮段。", tag: "超市" },
    { section: "39 / 早午餐", src: p(23), title: "早午餐", text: "这张适合把语气从攻略拉回生活。", note: "吃饭也是 citywalk。", tag: "外食" },
    { section: "40 / 正餐", src: p(24), title: "牛排薯条", text: "经典但不神化，讲你吃到的这一顿。", note: "外面吃一顿。", tag: "外食" },
    { section: "41 / 攀岩", src: p(21), title: "教堂空间里的攀岩馆", text: "它不是巴黎必去，但很像你真的在这里生活了一小会儿。", note: "这是你的个人标签。", tag: "小众" },
    { section: "42 / 攀岩", src: p(11), title: "攀岩馆内部", text: "做一次平时也会做的事，比打卡更进入当地生活。", note: "不要说成通用推荐。", tag: "日常" },
    { section: "43 / 河边", src: e("river-boxing"), title: "河边有人训练", text: "不是景点，但非常城市。", note: "这页讲巴黎的体感。", tag: "日常" },
    { section: "44 / 地铁", src: e("metro-card"), title: "交通别排太满", text: "巴黎不是远，是换乘和人流会慢慢偷走体力。", note: "作为节奏提醒，不评价具体的人。", tag: "交通" },
    { section: "45 / 地铁", src: p(14), title: "换乘会消耗体力", text: "这张点到为止，用来解释为什么一天不要排太满。", note: "讲节奏和体力，不讲人。", tag: "交通" },
    { section: "46 / 收束", src: e("eiffel-blue"), title: "最后回到这套节奏", text: "一馆、一街区、一傍晚。巴黎不是刷完的，是慢慢进入的。", note: "最后停一秒，让观众记住这句。", tag: "收束" }
  ]
};

const stickerPlan = {
  3: { src: "stickers/gpt-image/final/03-铁塔留给傍晚.png", prop: "tower", mood: "wonder", pose: "point", accent: "#f1b447", x: 79, y: 67, size: 21, rotate: -7 },
  4: { src: "stickers/gpt-image/final/04-水边蓝色时刻.png", prop: "river", mood: "calm", pose: "look", accent: "#2f7ed8", x: 24, y: 89, size: 20, rotate: 7 },
  5: { src: "stickers/gpt-image/final/05-雨后咖啡馆.png", prop: "cafe", mood: "smile", pose: "hold", accent: "#df6247", x: 76, y: 89, size: 19, rotate: 6 },
  6: { src: "stickers/gpt-image/final/06-灯亮以后.png", prop: "lamp", mood: "spark", pose: "wave", accent: "#f1b447", x: 24, y: 89, size: 19, rotate: -6 },
  7: { src: "stickers/gpt-image/final/07-路上的建筑.png", prop: "facade", mood: "focus", pose: "look", accent: "#8b73d9", x: 74, y: 57, size: 20, rotate: 9 },
  8: { src: "stickers/gpt-image/final/08-顺手一眼.png", prop: "shop", mood: "smile", pose: "lean", accent: "#4c9f70", x: 24, y: 59, size: 19, rotate: -10 },
  9: { src: "stickers/gpt-image/final/09-城市字体.png", prop: "letters", mood: "focus", pose: "point", accent: "#2f7ed8", x: 80, y: 82, size: 18, rotate: -4 },
  10: { src: "stickers/gpt-image/final/10-荣军院穹顶.png", prop: "dome", mood: "wonder", pose: "point", accent: "#f1b447", x: 18, y: 82, size: 19, rotate: 6 },
  11: { src: "stickers/gpt-image/final/11-拿破仑墓.png", prop: "tomb", mood: "calm", pose: "hold", accent: "#d4a15d", x: 76, y: 89, size: 19, rotate: -8 },
  12: { src: "stickers/gpt-image/final/12-战争宣传画.png", prop: "poster", mood: "focus", pose: "look", accent: "#df6247", x: 24, y: 89, size: 18, rotate: 8 },
  13: { src: "stickers/gpt-image/final/13-近现代史切片.png", prop: "poster", mood: "focus", pose: "point", accent: "#2f7ed8", x: 80, y: 35, size: 18, rotate: -7 },
  14: { src: "stickers/gpt-image/final/14-国家叙事.png", prop: "gallery", mood: "wonder", pose: "lean", accent: "#8b73d9", x: 22, y: 32, size: 19, rotate: 6 },
  15: { src: "stickers/gpt-image/final/15-不止浪漫.png", prop: "poster", mood: "tired", pose: "hold", accent: "#d54b61", x: 77, y: 82, size: 18, rotate: -5 },
  16: { src: "stickers/gpt-image/final/16-展厅细节.png", prop: "gallery", mood: "calm", pose: "look", accent: "#4c9f70", x: 18, y: 78, size: 18, rotate: 8 },
  17: { src: "stickers/gpt-image/final/17-雕塑.png", prop: "gallery", mood: "spark", pose: "point", accent: "#f1b447", x: 80, y: 32, size: 16, rotate: -9 },
  18: { src: "stickers/gpt-image/final/18-审美切片.png", prop: "gallery", mood: "calm", pose: "lean", accent: "#8b73d9", x: 25, y: 54, size: 16, rotate: 10 },
  19: { src: "stickers/gpt-image/final/19-馆里的人.png", prop: "people", mood: "smile", pose: "look", accent: "#df6247", x: 79, y: 60, size: 16, rotate: -7 },
  20: { src: "stickers/gpt-image/final/20-雨里看巴黎醒来.png", prop: "rain", mood: "tired", pose: "walk", accent: "#2f7ed8", x: 76, y: 89, size: 18, rotate: 6 },
  21: { src: "stickers/gpt-image/final/21-清晨祷告.png", prop: "candle", mood: "calm", pose: "hold", accent: "#f1b447", x: 23, y: 72, size: 18, rotate: -6 },
  22: { src: "stickers/gpt-image/final/22-墓地的安静.png", prop: "tomb", mood: "calm", pose: "look", accent: "#8b73d9", x: 79, y: 35, size: 16, rotate: 8 },
  23: { src: "stickers/gpt-image/final/23-墓园细节.png", prop: "tomb", mood: "focus", pose: "lean", accent: "#4c9f70", x: 20, y: 35, size: 16, rotate: -8 },
  24: { src: "stickers/gpt-image/final/24-名人墓碑.png", prop: "tomb", mood: "wonder", pose: "point", accent: "#d4a15d", x: 77, y: 82, size: 17, rotate: 5 },
  25: { src: "stickers/gpt-image/final/25-停下来想一会儿.png", prop: "route", mood: "calm", pose: "hold", accent: "#2f7ed8", x: 21, y: 83, size: 17, rotate: -6 },
  26: { src: "stickers/gpt-image/final/26-窗边和沙发.png", prop: "home", mood: "smile", pose: "hold", accent: "#4c9f70", x: 76, y: 89, size: 18, rotate: 8 },
  27: { src: "stickers/gpt-image/final/27-住处先让人坐下来.png", prop: "home", mood: "calm", pose: "lean", accent: "#f1b447", x: 24, y: 89, size: 18, rotate: -9 },
  28: { src: "stickers/gpt-image/final/28-楼下有花和咖啡.png", prop: "flower", mood: "spark", pose: "wave", accent: "#d54b61", x: 78, y: 73, size: 18, rotate: -7 },
  29: { src: "stickers/gpt-image/final/29-路上的画.png", prop: "spray", mood: "focus", pose: "point", accent: "#2f7ed8", x: 23, y: 72, size: 16, rotate: 7 },
  30: { src: "stickers/gpt-image/final/30-小店细节.png", prop: "shop", mood: "smile", pose: "look", accent: "#4c9f70", x: 76, y: 89, size: 18, rotate: 5 },
  31: { src: "stickers/gpt-image/final/31-面包店也要逛.png", prop: "bread", mood: "wonder", pose: "hold", accent: "#d99b45", x: 24, y: 89, size: 19, rotate: -6 },
  32: { src: "stickers/gpt-image/final/32-超市比纪念品店更像目的地.png", prop: "market", mood: "spark", pose: "walk", accent: "#4c9f70", x: 76, y: 89, size: 18, rotate: 9 },
  33: { src: "stickers/gpt-image/final/33-回民宿做一点.png", prop: "pan", mood: "smile", pose: "hold", accent: "#df6247", x: 28, y: 58, size: 17, rotate: -10 },
  34: { src: "stickers/gpt-image/final/34-甜点不用复杂.png", prop: "dessert", mood: "spark", pose: "lean", accent: "#f1b447", x: 82, y: 83, size: 17, rotate: -4 },
  35: { src: "stickers/gpt-image/final/35-一顿正餐.png", prop: "plate", mood: "calm", pose: "hold", accent: "#df6247", x: 18, y: 84, size: 17, rotate: 6 },
  36: { src: "stickers/gpt-image/final/36-炸物沙拉.png", prop: "plate", mood: "smile", pose: "point", accent: "#4c9f70", x: 78, y: 68, size: 16, rotate: -7 },
  37: { src: "stickers/gpt-image/final/37-带走也可以.png", prop: "bag", mood: "smile", pose: "walk", accent: "#f1b447", x: 24, y: 89, size: 18, rotate: 8 },
  38: { src: "stickers/gpt-image/final/38-逛货架.png", prop: "market", mood: "focus", pose: "look", accent: "#2f7ed8", x: 80, y: 36, size: 16, rotate: -8 },
  39: { src: "stickers/gpt-image/final/39-早午餐.png", prop: "cafe", mood: "smile", pose: "lean", accent: "#df6247", x: 22, y: 82, size: 17, rotate: 7 },
  40: { src: "stickers/gpt-image/final/40-牛排薯条.png", prop: "plate", mood: "wonder", pose: "hold", accent: "#d99b45", x: 79, y: 78, size: 16, rotate: -5 },
  41: { src: "stickers/gpt-image/final/41-教堂空间里的攀岩馆.png", prop: "climb", mood: "spark", pose: "point", accent: "#2f7ed8", x: 24, y: 89, size: 20, rotate: -8 },
  42: { src: "stickers/gpt-image/final/42-攀岩馆内部.png", prop: "climb", mood: "focus", pose: "lean", accent: "#4c9f70", x: 78, y: 72, size: 17, rotate: 7 },
  43: { src: "stickers/gpt-image/final/43-河边有人训练.png", prop: "boxing", mood: "wonder", pose: "point", accent: "#df6247", x: 24, y: 72, size: 17, rotate: -8 },
  44: { src: "stickers/gpt-image/final/44-交通别排太满.png", prop: "metro", mood: "tired", pose: "walk", accent: "#2f7ed8", x: 78, y: 82, size: 16, rotate: 6 },
  45: { src: "stickers/gpt-image/final/45-换乘会消耗体力.png", prop: "metro", mood: "tired", pose: "look", accent: "#f1b447", x: 18, y: 78, size: 17, rotate: -6 },
  46: { src: "stickers/gpt-image/final/46-最后回到这套节奏.png", prop: "route", mood: "calm", pose: "wave", accent: "#2f7ed8", x: 78, y: 74, size: 17, rotate: 7 }
};

window.TRAVEL_GUIDE.slides.forEach((slide, index) => {
  const page = index + 1;
  if (slide.kind !== "map") {
    slide.sticker = stickerPlan[page] || slide.sticker;
  }
});
