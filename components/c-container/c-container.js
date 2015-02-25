'use strict';

var config = require('config');

/* 容器组件类(容器组件的抽象)
  [INIT]
    parent       : 父组件对象的引用
    enableMoving : 是否允许移动

  [PROPERTIES]
    container : Container实例
    tween     : Tween实例
    parent    : 当前组件的父组件（一般用于计算StageX/Y）
    stage     : 公共的Stage实例
    moving    : 是否正在移动
    pos       : 坐标信息
      x, y           : 相对于所属容器的坐标
      stageX, stageY : 相对于Stage的坐标，通过parent的递归来计算
      scaleX, scaleY : x/y方向放大缩小的值
    config    : 配置信息
      enableMoving : 是否允许移动
    _offset   : 触摸点距离组件坐标位置的相对位移
    
  [METHODS]
    addChild(child)                 : 添加组件到container中，接受多种参数格式和类型：单个对象、对象数组、未命名参数对象,目前hardcode为只接受createjs中的Container和Shape类型的实例
    removeChild(child)              : 从container中删除组件，可接受的参数格式和类型同上
    update()                        : 更新视图
    move(x, y)                      : 将组件移动(x, y)个单位
    moveTo(x, y)                    : 将组件移动至(x, y)位置
    _mouseDownHandler(evt, _offset) : 鼠标按下事件handler
    _pressMoveHandler(evt, _offset) : 鼠标移动事件handler
    _pressUpHandler()               : 鼠标松开事件handler
*/

module.exports = Object.subClass({
  init: function(options) {
    var that = this;

    // 每一个容器都有一个container实例
    this.container = new createjs.Container();

    // 每一个容器都有一个补间动画实例
    this.tween = null;

    // 可以通过options设定父container
    this.parent = options && options.parent || null;

    this.stage.addChild(this.container);

    var enableMoving = false;

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
            that.container.removeAllEventListeners();
            that.container.on('mousedown', that._mouseDownHandler, that);
            that.container.on('pressmove', that._pressMoveHandler, that);
            that.container.on('pressup', that._pressUpHandler, that);
          } else {
            // 解绑事件
            that.container.removeAllEventListeners();
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
  _pressMoveHandler: function(evt) {
    this.moveTo(evt.stageX + this._offset.x, evt.stageY + this._offset.y);
  },
  _mouseDownHandler: function(evt) {
    this._offset.x = this.pos.x - evt.stageX;
    this._offset.y = this.pos.y - evt.stageY;
  },
  _pressUpHandler: function() {},
  stage: config.stage
});