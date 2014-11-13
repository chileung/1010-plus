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
			enableMoving = false,
			_offset = {
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
	_pressUpHandler: function(evt, _offset) {

	},
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

		this.setOut();
	},
	releaseLittleSquare: function(square) {
		// 释放子组件
		this.removeChild(square.shape);

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
		this._super.apply(this, arguments);
		// 子类扩展该方法
		this.kursaal.settle(this);
		this.kursaal.elim();
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
		options = options || {};
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

		this.mapWidth = config.mapSize * config.size;
		this.mapHeight = config.mapSize * config.size;

		// temp todo
		var test = new createjs.Shape();
		test.graphics.beginFill('yellow').drawRect(0, 0, this.mapWidth, this.mapHeight);
		this.addChild(test);
		this.update();
		// temp end
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
			while (centerX - (config.size * locaX + that.pos.x) > config.size) {
				locaX++;
			}

			while (centerY - (config.size * locaY + that.pos.y) > config.size) {
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
			that.addChild(square.shape);

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

				that.removeChild(square.shape);

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

/* 小正方类 */
var LittleSquare = DisplayObj.subClass({
	init: function(size, color) {
		this._super();
		this.color = color || config.color;
		this.width = size || config.size;
		this.height = size || config.size;

		// initialize shape
		// todo
		this.shape.graphics.beginFill('red').drawRect(0, 0, this.width, this.height);
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
		this.kursaal = options.kursaal || null;

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
			this.brickList.push(new Brick({
				shapeName: this._randomList[parseInt(Math.random() * this._randomList.length)],
				parent: this,
				enableMoving: true
			}));
		}
		return this;
	},
	display: function() {
		if (!!!this.kursaal) {
			return false;
		}

		// 设置积木的属性
		for (var i = 0, len = this.brickList.length; i < len; i++) {
			// 添加积木到自己的容器中
			this.addChild(this.brickList[i].container);
			// 设置积木即将要放置的娱乐城
			this.brickList[i].setKursaal(this.kursaal);
			// temp todo
			// UI层面的布局，待完善
			this.brickList[i].moveTo(i * config.size * 4, 0);
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
	_pressDownHandler:function() {
		// 记录现有积木的位置，以便其摆放失败后可以返回原位
		// todo
	},
	_pressUpHandler: function() {
		this._super.apply(this, arguments);

		// 检查积木是否已经安装到娱乐场中
		for (var i = 0, len = this.brickList.length; i < len;) {
			if (this.brickList[i].isNull()) {
				// 将积木从自己的容器中删除
				this.removeChild(this.brickList[i].container);
				this.brickList.splice(i, 1);
				len--;
			} else {
				i++;
			}
		}

		// 将移动失败的积木放回原位
		// todo

		if (this.brickList.length !== 0 && this.kursaal.isGameOver(this)) {
			// todo
			alert('game over ~');
		} else if (this.brickList.length === 0) {
			this.random().display();
		}
	}
});