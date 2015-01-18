'use strict';

var Page = require('c-page');
var page = new Page({
	tpl: __inline('p-game.html')
});

var Counter = require('c-counter');
var config = require('config');
var Kursaal = require('c-kursaal');
var RandomBrickGenerator = require('c-randombrickgenerator');

var generator = null;

var settingArea = null;

page.load = function() {
	require('canvasImg/i-start').initialize();
	require('canvasImg/i-setting').initialize();
	require('canvasImg/i-fork').initialize();
	require('canvasImg/i-back').initialize();
	require('canvasImg/i-logo').initialize();
	require('canvasImg/i-home').initialize();

	settingArea = document.querySelector('#p-game .setting-area');

	document.querySelector('#p-game .i-setting.btn').addEventListener('click', function(){
		settingArea.classList.add('scrollUp');
	});

  document.querySelector('#p-game .setting-area .back.btn').addEventListener('click', function() {
    settingArea.classList.remove('scrollUp');
  });
};

page.show = function(state) {
	createjs.Touch.enable(config.stage);

	// relate to FPS
	createjs.Ticker.framerate = 1000;

	createjs.Ticker.addEventListener('tick', function(){
		config.stage.update();
	});

	// main
	var counter = new Counter();
	var playground = new Kursaal({
		counter: counter
	});
	
	generator = new RandomBrickGenerator({
		enableMoving: true
	});

	// 设置生成器要服务的娱乐场
	generator.setKursaal(playground);

	// 摆放位置
	generator.moveTo(30, playground.mapHeight + 100 + config.size * 1.5);
	playground.moveTo((config.stage.canvas.width - playground.mapWidth) / 2, 100);
	counter.moveTo((config.stage.canvas.width - playground.mapWidth) / 2, 65);

	// 启动游戏
	generator.start();

	window.stage.canvas.className = 'show';
};

page.hide = function() {
	createjs.Touch.disable(config.stage);
	createjs.Ticker.removeAllEventListeners('tick');

	// 销毁生成器，当停止游戏时需要调用
	generator.destroy();

	settingArea.classList.remove('scrollUp');

	window.stage.canvas.className = 'hide';
};

module.exports = page;