// main
var playground = new Kursaal();
var generator = new RandomBrickGenerator();

// 设置生成器要服务的娱乐场
generator.setKursaal(playground);

// 摆放位置
generator.moveTo(400, 700);
playground.moveTo(400, 100);

// 启动游戏
generator.start();