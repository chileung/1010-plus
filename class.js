/* 展示组件的基类
	public properties:
 		obj shape : Shape实例
 		obj pos   : 坐标信息，x & y
 		obj stage : 公共的Stage实例
 	public methods:
		update move(x,y)
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
	stage: config.stage
});

// 容器的基类
// expose properties:
// container stage pos(x,y)
// expose methods:
// addChild removeChild update move(x,y) moveTo(x,y)
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