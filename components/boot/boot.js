'use strict';

module.exports = function() {
	// main
	var counter = new Counter();
	var playground = new Kursaal({
		counter: counter
	});
	var generator = new RandomBrickGenerator({
		enableMoving: true
	});

	// 设置生成器要服务的娱乐场
	generator.setKursaal(playground);

	// 摆放位置
	generator.moveTo(30, playground.mapHeight + 100 + config.size * 1.5);
	playground.moveTo((config.stage.canvas.width - playground.mapWidth) / 2, 100);
	counter.moveTo((config.stage.canvas.width - playground.mapWidth) / 2, 50);

	// 启动游戏
	generator.start();
};