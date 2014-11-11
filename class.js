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

	private properties:
		obj _offset    : 触摸点距离坐标信息的距离，x & y
		
	public methods:
		addChild(child)		: 添加子组件到Container实例中，接受多种参数格式：单个对象、对象数组、未命名参数对象 
		removeChild(child)	: 从Container实例中删除子组件，成功则返回true
		update				: 更新视图
		move(x,y)  			: 将组件移动{x,y}个单位
		moveTo(x,y)			: 将组件移动至{x,y}位置
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

		this.config = Object.defineProperties({}, {
			enableMoving: {
				get: function(value) {
					return this.value || false;
				},
				set: function(value) {
					this.value = value;

					if (this.value) {
						// 绑定事件
						that.container.on('mousedown', function(evt) {
							_offset.x = that.pos.x - evt.stageX;
							_offset.y = that.pos.y - evt.stageY;
						});

						that.container.on('pressmove', function(evt) {
							that.moveTo(evt.stageX + _offset.x, evt.stageY + _offset.y);
						});
					} else {
						// 解绑事件
						that.container.off('mousedown');
						that.container.off('pressmove');
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
	stage: config.stage
});

/* 积木类 extend Container
	public properties:
		littleSquareList : 小正方集合
		shapeDesc		 : 形状描述

	public methods:
		releaseLittleSquare(square)	: 将小正方从自身中释放，成功则返回true
		setOut()					: 堆叠成积木
*/
var Brick = Container.subClass({
	init: function() {
		this._super();

		// 引用类型的值不可以作为父类共享属性
		this.shapeDesc = [];

		var that = this;
		this.container.on('pressup', function(evt) {
			that.kursaal.settle(that);
		});
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
	}
});