// 具体某种积木类
var I = Brick.subClass({
	init: function(shapeDesc) {
		this._super();
		this.shapeDesc = shapeDesc || [];
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

/* 游乐场类 extend Container
	public properties:
		arr map 	: 一个二维的正方地图
		mapWidth	: 地图宽度
		mapHeight 	: 地图高度
	
	public methods:
		addLittleSquare		: 添加小正方
		removeLittleSquare	: 删除小正方
		contain(brick) 		: 积木brick是否在游乐场范围内，返回bool
		settle(brick)  		: 将积木安装在游乐场中，失败返回false
*/
var Kursaal = Container.subClass({
	init: function() {
		this._super();
		this.map = (function(that) {
			var ret = new Array(config.mapSize);
			for (var i = 0, len = ret.length; i < len; i++) {
				var arr = new Array(config.mapSize);
				for (var j = 0, jlen = arr.length; j < jlen; j++) {
					arr[j] = {
						square: null,
						isEmpty: true
					};
				}
				ret[i] = arr;
			}
			return ret;
		})(this);

		this.mapWidth = config.mapSize * config.size;
		this.mapHeight = config.mapSize * config.size;

		// temp todo
		var test = new createjs.Shape();
		test.graphics.beginFill('yellow').drawRect(0, 0, this.mapWidth, this.mapHeight);
		this.addChild(test);
	},
	addLittleSquare: function(square) {
		this.addChild(square.shape);
	},
	removeLittleSquare: function(square) {
		return this.removeChild(square.shape);
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

		brick.shapeDesc.forEach(function(val, key, arr) {
			// 计算出积木中每个正方所落在的位置
			var square = val.item,
				squareX = square.pos.x + brick.pos.x,
				squareY = square.pos.y + brick.pos.y,
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
		coordinates.forEach(function(coordinate) {
			var square = brick.shapeDesc[coordinate.listIndex].item;

			// 1.更新所属关系
			brick.releaseLittleSquare(square);
			that.addLittleSquare(square);

			// 2.更新map状态
			that.map[coordinate.x][coordinate.y].square = square;
			that.map[coordinate.x][coordinate.y].isEmpty = false;

			// 3.更新小正方位置
			square.moveTo(coordinate.x * config.size, coordinate.y * config.size);
		});
	},
	contain: function(brick) {
		if (!(brick instanceof Brick)) {
			return false;
		}

		var that = this,
			flag = true;

		// 检测积木里所有的正方是否都落在了游乐场里
		brick.shapeDesc.forEach(function(val, key, arr) {
			// 位置的比较需要一致的参照物，在这里应该是stage
			var square = val.item,
				squareX = square.pos.x + brick.pos.x,
				squareY = square.pos.y + brick.pos.y;

			if (squareX >= that.pos.x && squareX <= (that.pos.x + that.mapWidth - config.size) && squareY >= that.pos.y && squareY <= (that.pos.y + that.mapHeight - config.size)) {
				return true;
			} else {
				flag = false;
				return false;
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

// main
var playground = new Kursaal();
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
demo.setOut();
demo.setKursaal(playground);
playground.update();