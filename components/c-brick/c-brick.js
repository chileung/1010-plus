/* 抽象积木类 extend Container
  init options:
    shapeName : 形状名称
    color     : 颜色

  public properties:
    arr shapeDesc : 形状描述数组
      元素结构：{x : x坐标, y : y坐标, item : 小正方的引用, isSet : 当前坐标是否已绑定小正方}

  public methods:
    releaseLittleSquare(square) : 将小正方从自身container实例中删除，同时更新shapeDesc
    setOut(color)       : 堆叠成积木
    setKursaal(kursaal)     : 设置即将要放置到的娱乐场
    bigger()          : 放大当前积木
    smaller()         : 缩小当前积木
    resetSize()         : 将积木恢复原状
*/
var Brick = Container.subClass({
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
  bigger: function() {
    this.moving = true;

    var that = this;

    this.tween = createjs
      .Tween
      .get(this.container)
      .to({
        y: this.pos.y - config.moveUp,
        scaleX: config.scaleUp,
        scaleY: config.scaleUp
      }, 50)
      .call(function() {
        that.moving = false;
        // 更新偏移值(就因为这个东东，_offset需要从Private改为Public)
        that._offset.y -= config.moveUp;
      });
  },
  smaller: function() {
    var props = {
      y: this.pos.y + config.moveUp,
      scaleX: config.scaleDown,
      scaleY: config.scaleDown
    };

    if (arguments.length === 1) {
      var obj = arguments[0];

      for (var prop in obj) {
        props[prop] = obj[prop];
      }
    }

    this.moving = true;

    var that = this;

    this.tween = createjs
      .Tween
      .get(this.container)
      .to(props, 50)
      .call(function() {
        that.moving = false;
      });
  }
});