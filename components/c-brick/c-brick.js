'use strict';

var config = require('config');
var Container = require('c-container');
var LittleSquare = require('c-littlesquare');

/* 积木类
  [INIT]
    shapeName : 形状名称
    color     : 颜色

  [PROPERTIES]
    name      : 积木形状名
    score     : 积木所含分数
    isSettled : 是否已经被安置
    color     : 颜色
    moving    : 是否处于移动状态
    shapeDesc : 当前积木的形状描述数组
      元素结构 : {
        x: x坐标,
        y: y坐标,
        item: 小正方的引用
      }

  [METHODS]
    releaseLittleSquare(square) : 将小正方从自身中删除，同时更新shapeDesc
    setOut(color)               : 堆叠形成积木
    setKursaal(kursaal)         : 设置即将要放置到的娱乐场
    bigger()                    : 放大当前积木
    smaller()                   : 缩小当前积木
*/

module.exports = Container.subClass({
  init: function(options) {
    this._super(options);

    this.shapeDesc = JSON.parse(config.shapes[options.shapeName || 'point1']);
    this.name = options.shapeName || 'point1';
    this.score = this.shapeDesc.length || 0;
    this.isSettled = false;
    this.color = options.color || '';

    this.setOut(options.color);
  },
  releaseLittleSquare: function(square) {
    // 释放子组件
    this.removeChild(square);

    // 更新shapeDesc
    for (var i = 0, len = this.shapeDesc.length; i < len; i++) {
      if (this.shapeDesc[i].item === square) {
        this.shapeDesc[i].item = null;
        break;
      }
    }
  },
  setOut: function(color) {
    var that = this;

    this.shapeDesc.forEach(function(val, key, arr) {
      var square = new LittleSquare({
        color: color,
        parent: that
      });

      that.addChild(square);

      square.moveTo(val.x * (config.size + config.gap), val.y * (config.size + config.gap));
      arr[key].item = square;
    });
  },
  bigger: function(props) {
    var that = this;
    this.moving = true;

    props = props || {};

    props['scaleX'] = props['scaleX'] || config.scaleUp;
    props['scaleY'] = props['scaleY'] || config.scaleUp;

    // 记录变大的距离
    var offsetX = this.pos.x - props.x;
    var offsetY = this.pos.y - props.y;

    this.tween = createjs
      .Tween
      .get(this.container)
      .to(props, 50)
      .call(function() {
        that.moving = false;

        // 更新偏移值
        that._offset.x = that._offset.x + offsetX;
        that._offset.y = that._offset.y + offsetY;
      });
  },
  smaller: function(props) {
    var that = this;
    this.moving = true;

    props = props || {};

    props['scaleX'] = props['scaleX'] || config.scaleDown;
    props['scaleY'] = props['scaleY'] || config.scaleDown;

    this.tween = createjs
      .Tween
      .get(this.container)
      .to(props, 50)
      .call(function() {
        that.moving = false;
      });
  }
});