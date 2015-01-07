/* 展示组件类
  public properties:
    obj shape : Shape实例
    obj pos   : 坐标信息
      pos.x, pos.y : 相对于所属容器的坐标
    obj stage : 公共的Stage实例

  public methods:
    update()  : 更新视图
    move(x,y)   : 将组件移动{x,y}个单位
    moveTo(x,y) : 将组件移动至{x,y}位置
*/
var DisplayObj = Object.subClass({
  init: function(options) {
    var that = this;
    // 每一个显示组件都有一个shape实例
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