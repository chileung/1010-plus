// main
var playground = new Kursaal();
var generator = new RandomBrickGenerator();

// 设置生成器要服务的娱乐场
generator.setKursaal(playground);

// 摆放位置
generator.moveTo((config.stage.canvas.width - playground.mapWidth) / 2, config.stage.canvas.height - 25 - config.size * 5);
playground.moveTo((config.stage.canvas.width - playground.mapWidth) / 2, 100);

// 启动游戏
generator.start();