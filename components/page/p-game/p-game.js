'use strict';

var Page = require('c-page');
var page = new Page({
	tpl: __inline('p-game.html')
});

page.show = function(state) {
	var Counter = require('c-counter');
	var config = require('config');
	var Kursaal = require('c-kursaal');
	var RandomBrickGenerator = require('c-randombrickgenerator');

	createjs.Touch.enable(config.stage);
	createjs.Ticker.setFPS(75);
	createjs.Ticker.addEventListener('tick', config.stage);

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

	window.stage.canvas.className = 'show';
};

page.hide = function() {

};

module.exports = page;