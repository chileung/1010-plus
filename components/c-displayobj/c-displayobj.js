'use strict';

var config = require('config');

/* 展示组件类(展示组件的抽象)
  [INIT]
    parent: 父组件对象的引用
    
  [PROPERTIES]
    shape : Shape实例
    parent: 当前组件的父组件（一般用于计算StageX/Y）
    stage : 公共的Stage实例
    pos   : 坐标信息
      x, y           : 相对于所属容器的坐标
      stageX, stageY : 相对于Stage的坐标

  [METHODS]
    update()     : 更新视图
    move(x, y)   : 将组件移动(x, y)个单位
    moveTo(x, y) : 将组件移动至(x, y)位置
*/

module.exports = Object.subClass({
  init: function(options) {
    var that = this;

    // 每一个显示组件都有一个Shape实例
    this.shape = new createjs.Shape();

    this.parent = options && options.parent || null;

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