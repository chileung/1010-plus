// 基础配置
var config = {
	mapSize: 10,
	size: 50,
	color: 'red',
	canvasElm: 'myCanvas',
	stage: new createjs.Stage('myCanvas')
};

// 组件的基类
// expose properties:
// shape stage pos{x,y}
// expose methods:
// update move(x,y)
var DisplayObj = Object.subClass({
	init: function() {
		var that = this;
		// 每一个显示组件都有一个shape实例
		this.shape = new createjs.Shape();

		this.pos = Object.defineProperties({}, {
			x: {
				get: function() {
					return that.shape.x;
				},
				set: function(value) {
					that.shape.x = value;
				}
			},
			y: {
				get: function() {
					return that.shape.y;
				},
				set: function(value) {
					that.shape.y = value;
				}
			}
		});
	},
	update: function() {
		this.stage.update();
	},
	move: function(x, y) {
		this.pos.x += x;
		this.pos.y += y;
		this.update();
	},
	stage: config.stage
});

// 容器的基类
// expose properties:
// container stage pos(x,y)
// expose methods:
// addChild update move(x,y) moveTo(x,y)
var Container = Object.subClass({
	init: function() {
		var that = this;
		// 每一个容器都有一个container实例
		this.container = new createjs.Container();

		this.stage.addChild(this.container);

		this.pos = Object.defineProperties({}, {
			x: {
				get: function() {
					return that.container.x;
				},
				set: function(value) {
					that.container.x = value;
					that.update();
				}
			},
			y: {
				get: function() {
					return that.container.y;
				},
				set: function(value) {
					that.container.y = value;
					that.update();
				}
			}
		});

		var offset = {
			x: 0,
			y: 0
		};

		// 事件绑定
		this.container.on('mousedown', function(evt) {
			offset.x = that.pos.x - evt.stageX;
			offset.y = that.pos.y - evt.stageY;
		});

		this.container.on('pressmove', function(evt) {
			that.moveTo(evt.stageX + offset.x, evt.stageY + offset.y);
		});

		this.container.on('pressup', function(evt) {
			// todo
		});
	},
	addChild: function(child) {
		var that = this;
		if (Object.prototype.toString.apply(child) === '[object Array]') {
			child.forEach(function(val) {
				that.container.addChild(val);
			});
		} else {
			that.container.addChild(child);
		}

		if (arguments.length > 1) {
			for (var i = 1, len = arguments.length; i < len; i++) {
				if (Object.prototype.toString.apply(arguments[i]) === '[object Array]') {
					for (var j = 0, jlen = arguments[i].length, arr = arguments[i]; j < jlen; j++) {
						that.container.addChild(arr[j]);
					}
				} else {
					that.container.addChild(arguments[i]);
				}
			}
		}
	},
	update: function() {
		this.stage.update();
	},
	move: function(x, y) {
		this.pos.x += x;
		this.pos.y += y;
		this.update();
	},
	moveTo: function(x, y) {
		this.pos.x = x;
		this.pos.y = y;
		this.update();
	},
	stage: config.stage
});

// 积木基类
// expose properties:
// littleSuqareList shapeDesc
// expose methods:
// addLittleSuqares setOut
var Brick = Container.subClass({
	init: function() {
		this._super();

		// 引用类型的值不可以作为父类共享属性
		this.shapeDesc = [];
		this.littleSuqareList = [];
	},

	addLittleSuqares: function(suqares) {
		// 检测是否还需要添加小正方
		if (typeof this.shapeDesc.curIndex === 'number') {
			// 如果有索引记录的话，检测这个指向shapeDesc数组元素的索引
			if (this.shapeDesc.curIndex >= this.shapeDesc.length) {
				// 已经满员了~
				return false;
			}
		} else {
			// 如无索引记录，建立一个索引
			this.shapeDesc.curIndex = 0;
		}

		if (Object.prototype.toString.apply(suqares) === '[object Array]' && suqares.length > 0) {
			if (typeof suqares[0] === 'object' && suqares[0] instanceof LittleSuqare) {
				var that = this;
				suqares.forEach(function(val) {
					that.shapeDesc[that.shapeDesc.curIndex++].item = val;
					if (that.shapeDesc.curIndex >= that.shapeDesc.length) {
						return false;
					}
				});
			}
		} else if (typeof suqares === 'object' && suqares instanceof LittleSuqare) {
			this.shapeDesc[this.shapeDesc.curIndex++].item = suqares;
		}
	},
	setOut: function() {
		var that = this,
			flag = true;

		this.shapeDesc.forEach(function(val, key, arr) {
			if (!!val.item) {
				if (!val.isSet) {
					that.addChild(val.item.shape);
					val.item.pos.x = val.x * config.size;
					val.item.pos.y = val.y * config.size;
					arr[key].isSet = true;
				}
			} else {
				flag = false;
				return flag;
			}
		});

		if (!flag) {
			return {
				succ: false,
				msg: 'little suqares is not enough'
			};
		}
	}
});

// 具体某种积木类
var I = Brick.subClass({
	init: function(shapeDesc) {
		this._super();
		this.shapeDesc = shapeDesc || [];
	}
});

// 游乐场
var Kursaal = Container.subClass({
	init: function() {
		this._super();
		this.map = (function(that) {
			var ret = new Array(config.mapSize);
			for (var i = 0, len = ret.length; i < len; i++) {
				var arr = new Array(config.mapSize);
				arr.forEach(function(v, k, m) {
					m[k] = {
						suqare: null,
						isEmpty: true
					};
				});
				ret[i] = arr;
			}
			return ret;
		})(this);

		this.mapWidth = config.mapSize * config.size;
		this.mapHeight = config.mapSize * config.size;
	},
	settle: function(brick) {
		if (!(brick instanceof Brick)) {
			return {
				succ: false,
				msg: 'the param is not a brick!'
			};
		}
		if (!this.contain(brick)) {
			return {
				succ: false,
				msg: 'the param is not inside the kursaal!'
			};
		}

		var that = this;

		brick.littleSuqareList.forEach(function(val, key, arr) {
			// 计算出积木中每个正方所落在的位置
			var suqareX = val.pos.x + brick.x,
				suqareY = val.pos.y + brick.y,
				locaX = 0,
				locaY = 0;

			while (suqareX - config.size * locaX > config.size / 2) {
				locaX++;
			}

			while (suqareY - config.size * locaY > config.size / 2) {
				locaY++;
			}

			// 放置积木
			var location = that.map[locaX][locaY];
			if (location.isEmpty) {
				// 更新所属关系
				// todo

				// 更新状态
				location.suqare = val;
				location.isEmpty = false;

				// 更新位置
				// todo
			}
		});
	},
	contain: function(brick) {
		if (!(brick instanceof Brick)) {
			return false;
		}

		var that = this,
			flag = true;

		// 检测积木里所有的正方是否都落在了游乐场里
		brick.littleSuqareList.forEach(function(val, key, arr) {
			// 位置的比较需要一致的参照物，在这里应该是stage
			var suqareX = val.pos.x + brick.x,
				suqareY = val.pos.y + brick.y;

			if (suqareX >= that.x && suqareX <= (that.x + that.mapWidth - config.size) && suqareY >= that.y && suqareY <= (that.y + that.mapHeight - config.size)) {
				return true;
			} else {
				flag = false;
				return flag;
			}
		});

		return flag;
	},
	elim: function() {
		// todo
		// 消除符合规则的小正方
	},
	isGameOver: function() {
		// todo
		// 判断是否已经game over了
	}
});

// 小正方型
var LittleSuqare = DisplayObj.subClass({
	init: function(size, color) {
		this._super();
		this.color = color || config.color;
		this.width = size || config.size;
		this.height = size || config.size;

		// initialize shape
		// todo
		this.shape.graphics.beginFill('red').drawRect(0, 0, 50, 50);
	}
});

// 随机积木生成器
var RandomBrickGenerator = Container.subClass({
	init: function() {
		this._super();
	},
	random: function() {
		// todo
		// 生成一个随机形状的积木
	}
});

var playground = new Kursaal();

// main
var demo = new I([{
	x: 2,
	y: 2
}, {
	x: 2,
	y: 3
}, {
	x: 2,
	y: 4
}]);

demo.addLittleSuqares([new LittleSuqare(), new LittleSuqare(), new LittleSuqare()]);
demo.setOut();
demo.update();
// playground.settle(demo);
// playground.update();