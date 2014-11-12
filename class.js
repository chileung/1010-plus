/* 展示组件类
	public properties:
 		obj shape : Shape实例
 		obj pos   : 坐标信息，x & y
 		obj stage : 公共的Stage实例

 	public methods:
		update()	: 更新视图
		move(x,y)  	: 将组件移动{x,y}个单位
		moveTo(x,y)	: 将组件移动至{x,y}位置
*/
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
	moveTo: function(x, y) {
		this.pos.x = x;
		this.pos.y = y;
		this.update();
	},
	stage: config.stage
});

/* 容器组件类
	public properties:
		obj container : Container实例
		obj stage 	  : 公共的Stage实例
		obj pos 	  : 坐标信息，x & y
		obj config	  : 配置信息
			config.enableMoving : 是否允许移动

	private properties:
		obj  _offset    		: 触摸点距离坐标信息的距离，x & y
		
	public methods:
		addChild(child)		: 添加子组件到Container实例中，接受多种参数格式：单个对象、对象数组、未命名参数对象 
		removeChild(child)	: 从Container实例中删除子组件，成功则返回true
		update				: 更新视图
		move(x,y)  			: 将组件移动{x,y}个单位
		moveTo(x,y)			: 将组件移动至{x,y}位置

	private methods:
		_mouseDownHandler	: 鼠标按下事件handler
		_pressMoveHandler	: 鼠标移动事件handler
		_pressUpHandler 	: 鼠标松开事件handler
*/
var Container = Object.subClass({
	init: function() {
		var that = this;
		// 每一个容器都有一个container实例
		this.container = new createjs.Container();

		this.stage.addChild(this.container);

		var _offset = {
			x: 0,
			y: 0
		};

		this.config = Object.defineProperties({
			value: false
		}, {
			enableMoving: {
				get: function() {
					return this.value;
				},
				set: function(value) {
					this.value = value;

					if (this.value) {
						// 绑定事件
						that.container.off('mousedown', that._mouseDownHandler);
						that.container.on('mousedown', that._mouseDownHandler, that, false, _offset);
						that.container.off('pressmove', that._pressMoveHandler)
						that.container.on('pressmove', that._pressMoveHandler, that, false, _offset);
						that.container.off('pressup', that._pressUpHandler);
						that.container.on('pressup', that._pressUpHandler, that, false, _offset);
					} else {
						// 解绑事件
						that.container.off('mousedown', that._mouseDownHandler);
						that.container.off('pressmove', that._pressMoveHandler);
						that.container.off('pressup', that._pressUpHandler);
					}
				}
			}
		});

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
	removeChild: function(child) {
		return this.container.removeChild(child);
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
	_pressMoveHandler: function(evt, _offset) {
		this.moveTo(evt.stageX + _offset.x, evt.stageY + _offset.y);
	},
	_mouseDownHandler: function(evt, _offset) {
		_offset.x = this.pos.x - evt.stageX;
		_offset.y = this.pos.y - evt.stageY;
	},
	_pressUpHandler: function(evt, _offset) {},
	stage: config.stage
});

/* 抽象积木类 extend Container
	public properties:
		shapeDesc : 形状描述

	public methods:
		releaseLittleSquare(square)	: 将小正方从自身中释放，成功则返回true
		setOut()					: 堆叠成积木
		setKursaal(kursaal)		 	: 设置即将要放置到的娱乐场

	private methods:
		_pressUpHandler : 鼠标松开事件handler(扩展父类的方法)
*/
var Brick = Container.subClass({
	init: function() {
		this._super();

		// 引用类型的值不可以作为父类共享属性
		this.shapeDesc = [];
	},
	releaseLittleSquare: function(square) {
		// 仅仅是释放子组件，并没有更新shapeDesc里的关系
		return this.removeChild(square.shape);
	},
	setOut: function() {
		var that = this;

		this.shapeDesc.forEach(function(val, key, arr) {
			if (!val.isSet) {
				var square = new LittleSquare();
				that.addChild(square.shape);

				square.moveTo(val.x * config.size, val.y * config.size);
				arr[key].item = square;
				arr[key].isSet = true;
			}
		});
	},
	setKursaal: function(kursaal) {
		this.kursaal = kursaal;
	},
	_pressUpHandler: function(evt) {
		// 调用父类原来的方法
		this._super();
		// 子类扩展该方法
		this.kursaal.settle(this);
		this.kursaal.elim();
	}
});

/* 具体的积木类 */
var VerticalLine2 = Brick.subClass({
	init: function() {
		this._super();
		this.shapeDesc = JSON.parse(config.shapes.verticalLine2);
	}
});

/* 游乐场类 extend Container
	public properties:
		arr map 	: 一个二维的正方地图
			元素结构：{square : 小正方的引用, isEmpty : 当前元素是否为空}
		mapWidth	: 地图宽度
		mapHeight 	: 地图高度
	
	public methods:
		addLittleSquare		: 添加小正方
		removeLittleSquare	: 删除小正方
		contain(brick) 		: 积木brick是否在游乐场范围内，返回bool
		settle(brick)  		: 将积木安装在游乐场中，失败返回false
		elim				: 消除符合规则的小正方
		isGameOver			: 根据生成器来判断当前状态下是否game over
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
		var map = this.map,
			elimList = [],
			that = this,
			i, j, ilen, jlen;

		// 1.纵向检查
		for (i = 0, ilen = map.length; i < ilen; i++) {
			var needElim = true;
			for (j = 0, jlen = map[i].length; j < jlen; j++) {
				if (map[i][j].isEmpty) {
					needElim = false;
					break;
				}
			}

			if (needElim) {
				elimList.push({
					type: 'vertical',
					begin: {
						x: i,
						y: 0
					},
					end: {
						x: i,
						y: jlen - 1
					}
				});
			}
		}

		// 2.横向检查
		for (i = 0, ilen = map.length; i < ilen; i++) {
			var needElim = true;
			for (j = 0, jlen = map[i].length; j < jlen; j++) {
				if (map[j][i].isEmpty) {
					needElim = false;
					break;
				}
			}

			if (needElim) {
				elimList.push({
					type: 'horizontal',
					begin: {
						x: 0,
						y: i
					},
					end: {
						x: ilen - 1,
						y: i
					}
				});
			}
		}

		// 3.消除
		elimList.forEach(function(coordinate) {
			var x = coordinate.begin.x,
				y = coordinate.begin.y,
				square = null;

			for (; x === coordinate.end.x && y <= coordinate.end.y || y === coordinate.end.y && x <= coordinate.end.x;) {
				square = that.map[x][y].square;

				that.removeLittleSquare(square);

				that.map[x][y].square = null;
				that.map[x][y].isEmpty = true;

				that.update();

				if (coordinate.type === 'horizontal') {
					x++;
				} else if (coordinate.type === 'vertical') {
					y++;
				}
			}
		});
	},
	isGameOver: function(generator) {
		// todo
		// 判断是否已经game over了
		// this.map
		// generator
	}
});

/* 小正方类 */
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