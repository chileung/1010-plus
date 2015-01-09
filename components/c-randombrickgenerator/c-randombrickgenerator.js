'use strict';

var config = require('config');
var Container = require('c-container');
var Kursaal = require('c-kursaal');
var Brick = require('c-brick');
 
 /* 随机积木生成器
  [PROPERTIES]
    brickList : 现存积木列表数组
    kursaal   : 要服务的娱乐场的引用
    curBrick  : 当前选中的积木的引用
    width     : 生成器的宽度

  [METHODS]
    random()              : 生成若干个随机形状的积木,放到自己的brickList中
    display()             : 展示现存的积木
    start()               : 启动游戏
    setKursaal()          : 设置要服务的娱乐场
    _pressUpHandler()     : 鼠标松开事件handler
    _mouseDownHandler(evt): 鼠标点击事件handler
    _pressMoveHandler()   : 鼠标移动事件handler
*/

module.exports = Container.subClass({
  init: function(options) {
    this._super(options);

    this.brickList = [];
    this.kursaal = null;
    this.curBrick = null;
    this.width = config.stage.canvas.width - 30;

    // 用一个透明色的Shape垫底
    var bg = new createjs.Shape();

    this.addChild(bg);

    bg.graphics.beginStroke('#fff')
      .beginFill('#fff')
      .drawRect(0, 0, this.width, 5 * config.size + config.gap * 4);

    bg.alpha = 0.01;

    bg.on('pressmove', function(evt) {
      if (this.curBrick) {
        this.curBrick._pressMoveHandler.call(this.curBrick, evt, this.curBrick._offset);
      }
    }, this);
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
  destroy: function() {
    this.stage.removeAllChildren();
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

    // 当前区间不一定有积木，可能是空的。
    // 标记当前选中的积木
    this.curBrick = brick || null;

    if (this.curBrick) {
      this.curBrick._mouseDownHandler.call(this.curBrick, evt, this.curBrick._offset);

      if (!this.curBrick.moving) {
        // 记录积木被移动前的位置，以便摆放失败后可以自动回到原位
        this.curBrick.originalCoordinate = {
          x: brick.pos.x,
          y: brick.pos.y
        };

        // 鼠标按住后，积木放大
        this.curBrick.bigger();
      }
    }
  },
  _pressUpHandler: function() {
    var that = this;
    // 尝试将当前积木安放在娱乐场里
    that.kursaal.settle(that.curBrick || null, function() {
      // 检测当前娱乐场，并执行消除动作
      that.kursaal.elim();

      var list = that.brickList;

      // 检查积木是否已经安装到娱乐场中
      for (var i = 0, len = list.length; i < len; i++) {
        if (!list[i]) {
          continue;
        }

        if (list[i].isSettled) {
          // 将积木从自己的容器中删除
          that.removeChild(list[i]);
          list[i] = null;
        }
      }

      var brick = null;

      // 对放置失败的积木，需要放回原来的位置
      for (i = 0, len = list.length; i < len; i++) {
        if (!list[i]) {
          continue;
        } else {
          brick = list[i];
        }

        if (brick.originalCoordinate && (brick.originalCoordinate.x !== brick.pos.x || brick.originalCoordinate.y !== brick.pos.y)) {
          if (brick.moving) {
            createjs.Tween.removeAllTweens();
            brick.tween = createjs
              .Tween
              .get(brick.container)
              .to({
                y: brick.originalCoordinate.y,
                scaleX: config.scaleDown,
                scaleY: config.scaleDown
              }, 50)
              .call((function(brick) {
                return function() {
                  brick.moving = false;
                };
              })(brick));
          } else {
            // 积木缩小为原来的比例
            brick.smaller({
              x: brick.originalCoordinate.x,
              y: brick.originalCoordinate.y
            });
          }
        }
      }

      var hasBrick = false;
      list.forEach(function(item) {
        if (item) {
          hasBrick = true;
          return false;
        }
      });

      if (!hasBrick) {
        that.random().display();
      }

      if (that.kursaal.isGameOver(that)) {
        // todo
        alert('game over ~');
      }
    });
  },
  _pressMoveHandler: function() {
    // 因为enablemoving一次性设置了这三个Handler，所以这个空处理函数必须存在以覆盖父类对应方法
  }
});