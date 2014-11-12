/* 随机积木生成器 extend Container
	public properties:
		arr brickList : 现存积木列表
		obj kursaal   : 要服务的娱乐场的引用

	private properties:
		arr _randomList : 可供生成器选择的积木类型列表

	public methods:
		random  	: 生成若干个随机形状的积木,放回到自己的brickList
		display 	: 展示现存的积木
		start 		: 启动游戏的方法
		setKursaal	: 设置要服务的娱乐场

	private methods:
		_pressUpHandler : 鼠标松开事件handler
*/
var RandomBrickGenerator = Container.subClass({
	init: function() {
		this._super();

		this.brickList = [];
		this.kursaal = null;

		this.container.on('pressup', this._pressUpHandler, this);
	},
	setKursaal: function(kursaal) {
		this.kursaal = kursaal;
	},
	random: function() {
		if (this.brickList.length !== 0) {
			return this;
		}
		for (var i = 0; i < config.randomCount; i++) {
			this.brickList.push(new Brick(this._randomList[parseInt(Math.random() * this._randomList.length)]));
		}
		return this;
	},
	display: function() {
		if (!!!this.kursaal) {
			return false;
		}

		var that = this;

		// 设置积木的属性
		this.brickList.forEach(function(brick) {
			that.addChild(brick.container);
			brick.setKursaal(that.kursaal);
			brick.config.enableMoving = true;
		});

		// this.update();
		// todo
	},
	start: function() {
		this.random().display();
	},
	_randomList: (function() {
		var ret = [];
		for (var shapeName in config.shapes) {
			ret.push(shapeName);
		}
		return ret;
	})(),
	_pressUpHandler: function() {
		this._super();

		// todo

		// extend
		if (this.brickList.length === 0) {
			this.random().display();
		}
	}
});



// main
var playground = new Kursaal();
var generator = new RandomBrickGenerator();

// 设置生成器要服务的娱乐场
generator.setKursaal(playground);

// 启动游戏
generator.start();