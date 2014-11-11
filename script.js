// 积木基类
// expose properties:
// littleSquareList shapeDesc
// expose methods:
// addLittleSquare removeLittleSquare setOut
var Brick = Container.subClass({
	init: function() {
		this._super();

		// 引用类型的值不可以作为父类共享属性
		this.shapeDesc = [];
		this.littleSquareList = [];
	},

	addLittleSquare: function(square) {
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

		if (Object.prototype.toString.apply(square) === '[object Array]' && square.length > 0) {
			if (typeof square[0] === 'object' && square[0] instanceof LittleSquare) {
				var that = this;
				square.forEach(function(val) {
					that.shapeDesc[that.shapeDesc.curIndex++].item = val;
					if (that.shapeDesc.curIndex >= that.shapeDesc.length) {
						return false;
					}
				});
			}
		} else if (typeof square === 'object' && square instanceof LittleSquare) {
			this.shapeDesc[this.shapeDesc.curIndex++].item = square;
		}
	},
	removeLittleSquare: function(square) {
		this.removeChild(square.shape);

		return square;
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
				msg: 'little squares are not enough'
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
// expose properties:
// map[][] mapWidth mapHeight
// expose methods:
// contain(brick) 
var Kursaal = Container.subClass({
	init: function() {
		this._super();
		this.map = (function(that) {
			var ret = new Array(config.mapSize);
			for (var i = 0, len = ret.length; i < len; i++) {
				var arr = new Array(config.mapSize);
				arr.forEach(function(v, k, m) {
					m[k] = {
						square: null,
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

		// 首先检查当前放置的位置是否可行
		var that = this,
			available = true,
			coordinates = [];

		brick.littleSquareList.forEach(function(val, key, arr) {
			// 计算出积木中每个正方所落在的位置
			var squareX = val.pos.x + brick.pos.x,
				squareY = val.pos.y + brick.pos.y,
				locaX = 0,
				locaY = 0;

			while (squareX - (config.size * locaX + that.pos.x) > config.size / 2) {
				locaX++;
			}

			while (squareY - (config.size * locaY + that.pos.y) > config.size / 2) {
				locaY++;
			}

			if (!that.map[locaX][locaY].isEmpty) {
				available = false;
				return false;
			} else {
				// 当前正方可行，记录其需要摆放的坐标
				coordinates.push({
					x: locaX,
					y: locaY,
					listIndex: key
				});
			}
		});

		if (!available) {
			return {
				succ: false,
				msg: 'the position is unavailable!'
			};
		}

		// 若可行，则放置积木
		coordinates.forEach(function(coordinate){
			var square = brick.littleSquareList[coordinate.listIndex];

			// 1.更新所属关系
			that.addLittleSquare(brick.removeLittleSquare(square));

			// 2.更新map状态
			that.map[coordinate.x][coordinate.y].square = square;
			that.map[coordinate.x][coordinate.y].isEmpty = false;

			// 3.更新正方位置
			square coordinate.x
			coordinate.y
		});
	},
	contain: function(brick) {
		if (!(brick instanceof Brick)) {
			return false;
		}

		var that = this,
			flag = true;

		// 检测积木里所有的正方是否都落在了游乐场里
		brick.littleSquareList.forEach(function(val, key, arr) {
			// 位置的比较需要一致的参照物，在这里应该是stage
			var squareX = val.pos.x + brick.x,
				squareY = val.pos.y + brick.y;

			if (squareX >= that.x && squareX <= (that.x + that.mapWidth - config.size) && squareY >= that.y && squareY <= (that.y + that.mapHeight - config.size)) {
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
var LittleSquare = DisplayObj.subClass({
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

demo.addLittleSquare([new LittleSquare(), new LittleSquare(), new LittleSquare()]);
demo.setOut();
demo.update();

// playground.settle(demo);
// playground.update();