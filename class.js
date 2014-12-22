'use strict';

/* 展示组件类
	public properties:
 		obj shape : Shape实例
 		obj pos   : 坐标信息
 			pos.x, pos.y : 相对于所属容器的坐标
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
	},
	moveTo: function(x, y) {
		this.pos.x = x;
		this.pos.y = y;
	},
	stage: config.stage
});

/* 容器组件类
	init options:
		parent 		 : 当前container的父container的引用
		enableMoving : 设置是否允许移动
	public properties:
		obj container : Container实例
		obj parent	  : 当前组件的父组件的引用
		obj stage 	  : 公共的Stage实例
		obj pos 	  : 坐标信息
			pos.x, pos.y 			: 相对于所属容器的坐标
			pos.stageX, pos.stageY	: 相对于stage实例的坐标，通过parent的递归来计算
		obj config	  : 配置信息
			config.enableMoving : 是否允许移动

	private properties:
		obj  _offset    	: 触摸点距离坐标信息的距离，x & y
		
	public methods:
		addChild(child)		: 添加子组件到Container实例中，接受多种参数格式：单个对象、对象数组、未命名参数对象 
		removeChild(child)	: 从Container实例中删除子组件，成功则返回true
		update()			: 更新视图
		move(x,y)  			: 将组件移动{x,y}个单位
		moveTo(x,y)			: 将组件移动至{x,y}位置

	private methods:
		_mouseDownHandler()	: 鼠标按下事件handler
		_pressMoveHandler()	: 鼠标移动事件handler
		_pressUpHandler() 	: 鼠标松开事件handler
*/
var Container = Object.subClass({
	init: function(options) {
		var that = this;
		// 每一个容器都有一个container实例
		this.container = new createjs.Container();

		// 可以通过options设定父container
		this.parent = options && options.parent || null;

		this.stage.addChild(this.container);

		var stageX = 0,
			stageY = 0,
			enableMoving = false;

		this._offset = {
			x: 0,
			y: 0
		};

		this.config = Object.defineProperties({}, {
			enableMoving: {
				get: function() {
					return enableMoving;
				},
				set: function(value) {
					enableMoving = !!value;

					if (enableMoving) {
						// 绑定事件
						that.container.off('mousedown', that._mouseDownHandler);
						that.container.on('mousedown', that._mouseDownHandler, that, false, that._offset);
						that.container.off('pressmove', that._pressMoveHandler);
						that.container.on('pressmove', that._pressMoveHandler, that, false, that._offset);
						that.container.off('pressup', that._pressUpHandler);
						that.container.on('pressup', that._pressUpHandler, that, false, that._offset);
					} else {
						// 解绑事件
						that.container.off('mousedown', that._mouseDownHandler);
						that.container.off('pressmove', that._pressMoveHandler);
						that.container.off('pressup', that._pressUpHandler);
					}
				}
			}
		});

		this.config.enableMoving = options && options.enableMoving || false;

		this.pos = Object.defineProperties({}, {
			x: {
				get: function() {
					return that.container.x;
				},
				set: function(value) {
					that.container.x = value;
				}
			},
			y: {
				get: function() {
					return that.container.y;
				},
				set: function(value) {
					that.container.y = value;
				}
			},
			stageX: {
				get: function() {
					var x = 0,
						obj = that;
					while (!!obj) {
						x += obj.pos.x;
						obj = obj.parent;
					}
					return x;
				}
			},
			stageY: {
				get: function() {
					var y = 0,
						obj = that;
					while (!!obj) {
						y += obj.pos.y;
						obj = obj.parent;
					}
					return y;
				}
			},
			scaleX: {
				get: function() {
					return that.container.scaleX;
				},
				set: function(value) {
					that.container.scaleX = value;
				}
			},
			scaleY: {
				get: function() {
					return that.container.scaleY;
				},
				set: function(value) {
					that.container.scaleY = value;
				}
			}
		});
	},
	addChild: function(child) {
		var that = this;
		if (Object.prototype.toString.apply(child) === '[object Array]') {
			child.forEach(function(val) {
				if (val instanceof createjs.Shape || val instanceof createjs.Container) {
					that.container.addChild(val);
				} else if (val.shape && val.shape instanceof createjs.Shape) {
					that.container.addChild(val.shape);
				} else if (val.container && val.container instanceof createjs.Container) {
					that.container.addChild(val.container);
				}
			});
		} else {
			if (child instanceof createjs.Shape || child instanceof createjs.Container) {
				that.container.addChild(child);
			} else if (child.shape && child.shape instanceof createjs.Shape) {
				that.container.addChild(child.shape);
			} else if (child.container && child.container instanceof createjs.Container) {
				that.container.addChild(child.container);
			}
		}

		if (arguments.length > 1) {
			for (var i = 1, len = arguments.length; i < len; i++) {
				that.addChild.call(that, arguments[i]);
			}
		}
	},
	removeChild: function(child) {
		var that = this;
		if (Object.prototype.toString.apply(child) === '[object Array]') {
			child.forEach(function(val) {
				if (val instanceof createjs.Shape || val instanceof createjs.Container) {
					that.container.removeChild(val);
				} else if (val.shape && val.shape instanceof createjs.Shape) {
					that.container.removeChild(val.shape);
				} else if (val.container && val.container instanceof createjs.Container) {
					that.container.removeChild(val.container);
				}
			});
		} else {
			if (child instanceof createjs.Shape || child instanceof createjs.Container) {
				that.container.removeChild(child);
			} else if (child.shape && child.shape instanceof createjs.Shape) {
				that.container.removeChild(child.shape);
			} else if (child.container && child.container instanceof createjs.Container) {
				that.container.removeChild(child.container);
			}
		}

		if (arguments.length > 1) {
			for (var i = 1, len = arguments.length; i < len; i++) {
				that.removeChild.call(that, arguments[i]);
			}
		}
	},
	update: function() {
		this.stage.update();
	},
	move: function(x, y) {
		this.pos.x += x;
		this.pos.y += y;
	},
	moveTo: function(x, y) {
		this.pos.x = x;
		this.pos.y = y;
	},
	_pressMoveHandler: function(evt, _offset) {
		this.moveTo(evt.stageX + _offset.x, evt.stageY + _offset.y);
	},
	_mouseDownHandler: function(evt, _offset) {
		_offset.x = this.pos.x - evt.stageX;
		_offset.y = this.pos.y - evt.stageY;
	},
	_pressUpHandler: function() {},
	stage: config.stage
});

/* 抽象积木类 extend Container
	init options:
		shapeName : 形状名称
	public properties:
		arr shapeDesc : 形状描述
			元素结构：{x : x坐标, y : y坐标, item : 小正方的引用, isSet : 当前坐标是否已绑定小正方}

	public methods:
		releaseLittleSquare(square)	: 将小正方从自身container实例中删除，同时更新shapeDesc
		setOut()					: 堆叠成积木
		setKursaal(kursaal)		 	: 设置即将要放置到的娱乐场
		isNull()					: 当前积木是否已经删除所有小正方

	private methods:
		_pressUpHandler() : 鼠标松开事件handler(扩展父类的方法)
*/
var Brick = Container.subClass({
	init: function(options) {
		this._super(options);

		// 引用类型的值不可以作为父类共享属性
		this.shapeDesc = JSON.parse(config.shapes[options.shapeName || 'point1']);

		// 积木分数等于小正方的数量
		this.score = this.shapeDesc.length || 0;

		this.setOut(options.color);
	},
	releaseLittleSquare: function(square) {
		// 释放子组件
		this.removeChild(square);

		// 更新shapeDesc
		for (var i = 0, len = this.shapeDesc.length; i < len; i++) {
			if (this.shapeDesc[i].item === square) {
				this.shapeDesc[i].item = null;
				this.shapeDesc[i].isSet = false;
				break;
			}
		}
	},
	isNull: function() {
		var ret = true;
		this.shapeDesc.forEach(function(val) {
			if (val.isSet) {
				ret = false;
				return false;
			}
		});

		return ret;
	},
	setOut: function(color) {
		var that = this;

		this.shapeDesc.forEach(function(val, key, arr) {
			if (!val.isSet) {
				var square = new LittleSquare(color);
				that.addChild(square.shape);

				square.moveTo(val.x * (config.size + config.gap), val.y * (config.size + config.gap));
				arr[key].item = square;
				arr[key].isSet = true;
			}
		});
	},
	bigger: function() {
		this.pos.scaleX = this.pos.scaleY = config.scaleUp;
		this.pos.y -= config.moveUp;
		// 更新偏移值(就因为这个东东，_offset需要从Private改为Public)
		this._offset.y -= config.moveUp;
	},
	smaller: function() {
		this.pos.scaleX = this.pos.scaleY = config.scaleDown;
		this.pos.y += config.moveUp;
	},
	resetSize: function() {
		this.pos.scaleX = this.pos.scaleY = 1;
	}
});

/* 游乐场类 extend Container
	public properties:
		arr map 	: 一个二维的正方地图
			元素结构：{square : 小正方的引用, isEmpty : 当前元素是否为空}
		mapWidth	: 地图宽度
		mapHeight 	: 地图高度
	
	public methods:
		contain(brick) 			: 积木brick是否在游乐场范围内，返回bool
		settle(brick)  			: 将积木安装在游乐场中，失败返回false
		elim()					: 消除符合规则的小正方
		isGameOver()			: 根据生成器来判断当前状态下是否game over
*/
var Kursaal = Container.subClass({
	init: function(options) {
		this._super(options);
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

		this.mapWidth = config.mapSize * config.size + config.gap * (config.mapSize - 1);
		this.mapHeight = config.mapSize * config.size + config.gap * (config.mapSize - 1);

		// 实例化一个计分器
		this.counter = options.counter || null;

		// 建立背景图
		var bg = new Container({
			parent: this,
			enableMoving: false
		});

		for (var i = 0; i < config.mapSize; i++) {
			for (var j = 0; j < config.mapSize; j++) {
				var square = new LittleSquare(config.bgColor);
				bg.addChild(square.shape);
				square.moveTo(i * (config.size + config.gap), j * (config.size + config.gap));
			}
		}

		this.addChild(bg.container);
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

		brick.shapeDesc.forEach(function(val, key) {
			// 计算出积木中每个正方所落在的位置
			// 这里需要实现模糊匹配位置，直接影响到游戏体验

			var square = val.item,
				centerX = square.pos.x + brick.pos.stageX + config.size / 2,
				centerY = square.pos.y + brick.pos.stageY + config.size / 2,
				locaX = 0,
				locaY = 0;

			// 计算小正方的中心落在哪个位置
			while (centerX - ((config.size + config.gap) * locaX + that.pos.x) >= config.size) {
				locaX++;
			}

			while (centerY - ((config.size + config.gap) * locaY + that.pos.y) >= config.size) {
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
		} else {
			// 可行，则放置积木，并添加积木对应的分数
			this.counter.add(brick.score);

			coordinates.forEach(function(coordinate) {
				var square = brick.shapeDesc[coordinate.listIndex].item;

				// 1.更新所属关系
				brick.releaseLittleSquare(square);
				that.addChild(square);

				// 2.更新map状态
				that.map[coordinate.x][coordinate.y].square = square;
				that.map[coordinate.x][coordinate.y].isEmpty = false;

				// 3.更新小正方位置
				square.moveTo(coordinate.x * config.size + config.gap * coordinate.x, coordinate.y * config.size + config.gap * coordinate.y);
			});
		}
	},
	contain: function(brick) {
		if (!(brick instanceof Brick)) {
			return false;
		}

		var that = this,
			flag = true;

		// 检测积木里所有的正方的中心是否都落在了游乐场里
		brick.shapeDesc.forEach(function(val) {
			// 位置的比较需要一致的参照物，在这里应该是stage
			var square = val.item,
				centerX = square.pos.x + brick.pos.stageX + config.size / 2,
				centerY = square.pos.y + brick.pos.stageY + config.size / 2;

			if (centerX >= that.pos.x && centerX <= (that.pos.x + that.mapWidth) && centerY >= that.pos.y && centerY <= (that.pos.y + that.mapHeight)) {
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
			needElim = true,
			i, j, ilen, jlen;

		// 1.纵向检查
		for (i = 0, ilen = map.length; i < ilen; i++) {
			needElim = true;
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
			needElim = true;
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
			// 加分
			that.counter.add(config.mapSize);

			var x = coordinate.begin.x,
				y = coordinate.begin.y,
				square = null;

			for (; x === coordinate.end.x && y <= coordinate.end.y || y === coordinate.end.y && x <= coordinate.end.x;) {
				square = that.map[x][y].square;

				that.removeChild(square);

				that.map[x][y].square = null;
				that.map[x][y].isEmpty = true;

				if (coordinate.type === 'horizontal') {
					x++;
				} else if (coordinate.type === 'vertical') {
					y++;
				}
			}
		});
	},
	isGameOver: function(generator) {
		var that = this,
			map = this.map,
			isOver = true;

		for (var x = 0, xlen = map.length; x < xlen; x++) {
			for (var y = 0, ylen = map[x].length; y < ylen; y++) {
				if (!map[x][y].isEmpty) {
					continue;
				}
				// 遍历地图里每个格子，以该格子(x,y)为相对坐标，尝试根据积木的形状描述来组建一块虚拟的积木
				generator.brickList.forEach(function(brick) {
					if (!brick) {
						return true;
					}
					var desc = brick.shapeDesc;

					// 检查剩余的积木里是否还有一块能放进娱乐场，只要还有一块能够放进去，就还不算输
					for (var i = 1, descLen = desc.length; i < descLen; i++) {
						var relX = x - desc[0].x - desc[i].x,
							relY = y - desc[0].y - desc[i].y;

						if (relX < 0 || relX >= config.mapSize || relY < 0 || relY >= config.mapSize || !map[relX][relY].isEmpty) {
							break;
						}
					}

					if (i >= descLen) {
						// 可以放置
						isOver = false;
						return false;
					}
				});

				if (!isOver) {
					return isOver;
				}
			}
		}

		return isOver;
	}
});

/* 小正方类 extend DisplayObj
	init options:
		color : 一个表示颜色值的字符串	
*/
var LittleSquare = DisplayObj.subClass({
	init: function(color) {
		this._super();
		this.color = color || config.color;
		this.width = config.size;
		this.height = config.size;

		var PI = Math.PI;
		var r = config.radius;

		// initialize shape
		this.shape.graphics
			.beginStroke(this.color)
			.beginFill(this.color)
			.moveTo(0, r)
			.lineTo(0, this.height - r * 2)
			.arc(r, this.height - r, r, -PI, PI / 2, true)
			.lineTo(this.width - r, this.height)
			.arc(this.width - r, this.height - r, r, PI / 2, 0, true)
			.lineTo(this.width, r)
			.arc(this.width - r, r, r, 0, -PI / 2, true)
			.lineTo(r, 0)
			.arc(r, r, r, -PI / 2, PI, true);
	}
});

/* 随机积木生成器 extend Container
	public properties:
		arr brickList : 现存积木列表
		obj kursaal   : 要服务的娱乐场的引用

	private properties:
		arr _randomList : 可供生成器选择的积木类型列表

	public methods:
		random()  	 : 生成若干个随机形状的积木,放回到自己的brickList
		display() 	 : 展示现存的积木
		start() 	 : 启动游戏的方法
		setKursaal() : 设置要服务的娱乐场

	private methods:
		_pressUpHandler() : 鼠标松开事件handler
*/
var RandomBrickGenerator = Container.subClass({
	init: function(options) {
		this._super(options);

		this.brickList = [];
		this.kursaal = null;
		this.curBrick = null;

		this.width = config.stage.canvas.width;
	},
	setKursaal: function(kursaal) {
		if (kursaal instanceof Kursaal) {
			this.kursaal = kursaal;
			return true;
		} else {
			return false;
		}
	},
	random: function() {
		var hasBrick = false;
		this.brickList.forEach(function(brick) {
			if (brick) {
				hasBrick = true;
				return false;
			}
		});

		if (hasBrick) {
			return this;
		}

		for (var i = 0; i < config.randomCount; i++) {
			this.brickList[i] = new Brick({
				shapeName: this._randomList[parseInt(Math.random() * this._randomList.length)],
				parent: this,
				enableMoving: true,
				color: config.colorList[parseInt(Math.random() * config.colorList.length)]
			});
		}
		return this;
	},
	display: function() {
		if (!!!this.kursaal) {
			return false;
		}

		var brickWidth = config.size * 5 + config.gap * 4;

		// 设置积木的属性
		for (var i = 0, len = this.brickList.length; i < len; i++) {
			var brick = this.brickList[i];
			// 添加积木到自己的容器中
			this.addChild(brick);
			// 缩放
			brick.pos.scaleX = brick.pos.scaleY = config.scaleDown;
			// 布局
			brick.moveTo(this.width / 3 * i - (brickWidth / 2 - this.width / 6), 0);
		}
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
	_mouseDownHandler: function(evt) {
		// 确定当前点击的是哪个积木
		// 因为在当前这个container内，积木是分布在不同位置的，只有点击积木的时候，当前container的mouseDown事件才会触发
		// 因此，点击其他空白区域是不会触发当前事件的。基于这个背景，通过坐标判断就可行。
		var localX = evt.localX;

		for (var i = 1; i < config.randomCount; i++) {
			if (localX < this.width * i / 3 && localX > this.width * (i - 1) / 3) {
				break;
			}
		}

		var brick = this.brickList[i - 1];

		// 标记当前选中的积木
		this.curBrick = brick;

		// 记录积木被移动前的位置，以便摆放失败后可以自动回到原位
		brick.originalCoordinate = {
			x: brick.pos.x,
			y: brick.pos.y
		};

		// 鼠标按住后，积木放大	
		brick.bigger();
	},
	_pressUpHandler: function() {
		// 尝试将当前积木安放在娱乐场里
		this.kursaal.settle(this.curBrick || null);
		// 检测当前娱乐场，并执行消除动作
		this.kursaal.elim();

		var list = this.brickList;

		// 检查积木是否已经安装到娱乐场中
		for (var i = 0, len = list.length; i < len; i++) {
			if (!list[i]) {
				continue;
			}

			if (list[i].isNull()) {
				// 将积木从自己的容器中删除
				this.removeChild(list[i]);
				list[i] = null;
			}
		}

		// 对放置失败的积木，需要放回原来的位置
		for (i = 0, len = list.length; i < len; i++) {
			if (!list[i]) {
				continue;
			}

			if (list[i].originalCoordinate && (list[i].originalCoordinate.x !== list[i].pos.x || list[i].originalCoordinate.y !== list[i].pos.y)) {
				// 积木缩小为原来的比例
				list[i].smaller();
				list[i].moveTo(list[i].originalCoordinate.x, list[i].originalCoordinate.y);
			}
		}

		var hasBrick = false;
		list.forEach(function(brick) {
			if (brick) {
				hasBrick = true;
				return false;
			}
		});

		if (!hasBrick) {
			this.random().display();
		}

		if (this.kursaal.isGameOver(this)) {
			// todo
			alert('game over ~');
		}
	},
	_pressMoveHandler: function() {
		// 因为enablemoving一次性设置了这三个Handler，所以这个空处理函数必须存在以覆盖父类对应方法
	}
});

var Counter = Container.subClass({
	init: function() {
		this._super();

		var score = 0;
		var that = this;
		var text = new createjs.Text(score, config.fontSize + 'px Microsoft Yahei', '#ff7700');

		Object.defineProperties(this, {
			score: {
				get: function() {
					return score;
				},
				set: function(value) {
					if (typeof value !== 'number') {
						return false;
					}

					var i = score;

					score = value;

					(function next(){
						text.text = i++;

						if(i <= score){
							setTimeout(next, 50);
						}
					})();
				}
			}
		});

		this.container.addChild(text);
	},
	add: function(score) {
		if (typeof score !== 'number' || score < 0) {
			return false;
		}
		this.score += score;
	},
	subtract: function(score) {
		if (typeof score !== 'number' || score < 0) {
			return false;
		}
		this.score -= score;
	}
});