/* 容器组件类
  init options:
    parent     : 当前container的父container的引用(用于计算相对于stage的offset)
    enableMoving : 设置是否允许移动

  public properties:
    obj container : Container实例
    obj tween     : 补间动画实例
    obj parent    : 当前组件的父组件的引用
    obj stage     : 公共的Stage实例
    obj pos     : 坐标信息
      pos.x, pos.y      : 相对于所属容器的坐标
      pos.stageX, pos.stageY  : 相对于stage实例的坐标，通过parent的递归来计算
      pos.scaleX, pos.scaleY  : 放大缩小坐标
    obj config    : 配置信息
      config.enableMoving : 是否允许移动
    obj  _offset  : 触摸点距离坐标信息的距离，x & y
    bool _moving  : 是否正在移动
    
  public methods:
    addChild(child)   : 添加子组件到Container实例中，接受多种参数格式：单个对象、对象数组、未命名参数对象 
    removeChild(child)  : 从Container实例中删除子组件，（add和remove暂时只支持Container、Shape类型）
    update()      : 更新视图
    move(x,y)       : 将组件移动{x,y}个单位
    moveTo(x,y)     : 将组件移动至{x,y}位置

  private methods:
    _mouseDownHandler() : 鼠标按下事件handler
    _pressMoveHandler() : 鼠标移动事件handler
    _pressUpHandler()   : 鼠标松开事件handler
*/
var Container = Object.subClass({
  init: function(options) {
    var that = this;
    // 每一个容器都有一个container实例
    this.container = new createjs.Container();

    this.tween = null;

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

    this.moving = false;

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