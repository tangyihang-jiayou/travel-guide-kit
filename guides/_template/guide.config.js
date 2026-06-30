window.TRAVEL_GUIDE = {
  meta: {
    title: "城市名｜旅行攻略",
    city: "城市名",
    author: "旅行者",
    authorBadge: "旅",
    description: "一套以地图和原图为主的竖屏讲解稿。"
  },
  assetsBase: "./assets/",
  ui: {
    statusTime: "9:41",
    authorBadge: "旅"
  },
  sources: [
    // { title: "参考网页标题", url: "https://example.com", note: "为什么放进攻略" }
  ],
  slides: [
    {
      kind: "map",
      section: "01 / 我的地图",
      src: "maps/your-map.jpg",
      title: "先从这张图开始",
      text: "口播提示：先讲这个城市的路线框架。",
      tag: "地图"
    },
    {
      section: "02 / 第一站",
      src: "photos/image-1.jpg",
      title: "这里写短标题",
      text: "口播提示只写给自己看，不会默认显示在画面上。",
      tag: "现场",
      sticker: {
        prop: "cafe",
        mood: "smile",
        pose: "hold",
        accent: "#df6247",
        x: 78,
        y: 72,
        size: 17,
        rotate: -7
      }
    }
  ]
};
