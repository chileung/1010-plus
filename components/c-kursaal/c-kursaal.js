/* 游乐场类 extend Container
  init options:
    counter: 一个计分器实例

  public properties:
    arr map   : 一个二维的正方地图
      元素结构：{square : 小正方的引用, isEmpty : 当前元素是否为空}
    mapWidth  : 地图宽度
    mapHeight   : 地图高度
  
  public methods:
    contain(brick)      : 判断给定的积木是否在游乐场范围内，返回bool
    settle(brick)       : 将积木安装在游乐场中，失败返回false
    elim()          : 消除符合规则的小正方
    isGameOver()      : 根据生成器中剩余的积木来判断当前状态下是否game over
*/
var Kursaal = Container.subClass({
  init: function(options) {
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

    this.mapWidth = config.mapSize * config.size + config.gap * (config.mapSize - 1);
    this.mapHeight = config.mapSize * config.size + config.gap * (config.mapSize - 1);

    // 实例化一个计分器
    this.counter = options.counter || null;

    // 建立背景图
    var bg = new Container({
      parent: this
    });

    for (var i = 0; i < config.mapSize; i++) {
      for (var j = 0; j < config.mapSize; j++) {
        var square = new LittleSquare({
          color: config.bgColor
        });
        bg.addChild(square);
        square.moveTo(i * (config.size + config.gap), j * (config.size + config.gap));
      }
    }

    this.addChild(bg);
  },
  settle: function(brick, callback) {
    if (!(brick instanceof Brick) || !this.contain(brick)) {
      callback && callback.apply(this);
      return false;
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
      while (centerX - ((config.size + config.gap) * locaX + that.pos.x) >= config.size) {
        locaX++;
      }

      while (centerY - ((config.size + config.gap) * locaY + that.pos.y) >= config.size) {
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
      callback && callback.apply(that);
      return false;
    } else {
      // 可行，则放置积木，并添加积木对应的分数
      this.counter.add(brick.score);

      brick.isSettled = true;

      // 计算相对位移
      var coordinate = coordinates[0];
      var square = brick.shapeDesc[coordinate.listIndex].item;

      var relX = that.pos.stageX + coordinate.x * config.size + config.gap * coordinate.x - square.pos.stageX;
      var relY = that.pos.stageY + coordinate.y * config.size + config.gap * coordinate.y - square.pos.stageY;

      createjs
        .Tween
        .get(brick.container)
        .to({
          x: brick.pos.x + relX,
          y: brick.pos.y + relY,
          scaleX: 1,
          scaleY: 1
        }, 50)
        .call(function() {
          coordinates.forEach(function(coordinate) {
            // 在相应的位置生成小正方
            var newSquare = new LittleSquare({
              parent: that,
              color: brick.color
            });

            that.addChild(newSquare);

            that.map[coordinate.x][coordinate.y].square = newSquare;
            that.map[coordinate.x][coordinate.y].isEmpty = false;

            newSquare.moveTo(coordinate.x * (config.size + config.gap), (config.size + config.gap) * coordinate.y);

            brick.releaseLittleSquare(brick.shapeDesc[coordinate.listIndex].item)
          });

          callback && callback.apply(that);
        });
    }
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
      needElim = true,
      i, j, ilen, jlen;

    // 1.纵向检查
    for (i = 0, ilen = map.length; i < ilen; i++) {
      needElim = true;
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
      needElim = true;
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
      // 加分
      that.counter.add(config.mapSize);

      var x = coordinate.begin.x,
        y = coordinate.begin.y,
        square = null;

      for (var index = 0; x === coordinate.end.x && y <= coordinate.end.y || y === coordinate.end.y && x <= coordinate.end.x; index++) {
        square = that.map[x][y].square;

        if (square) {
          createjs
            .Tween
            .get(square.shape)
            .wait(index * 35)
            .to({
              scaleX: config.scaleUp,
              scaleY: config.scaleUp
            }, 150)
            .to({
              x: square.pos.x + square.width / 2,
              y: square.pos.y + square.height / 2,
              scaleX: 0,
              scaleY: 0
            }, 100)
            .call((function(s) {
              return function() {
                that.removeChild(s);
              };
            })(square));

          that.map[x][y].square = null;
          that.map[x][y].isEmpty = true;
        }

        if (coordinate.type === 'horizontal') {
          x++;
        } else if (coordinate.type === 'vertical') {
          y++;
        }
      }
    });
  },
  isGameOver: function(generator) {
    var map = this.map,
      isOver = true;

    for (var x = 0, xlen = map.length; x < xlen; x++) {
      for (var y = 0, ylen = map[x].length; y < ylen; y++) {
        if (!map[x][y].isEmpty) {
          continue;
        }
        // 遍历地图里每个空的格子，以该格子(x,y)为相对坐标，尝试根据积木的形状描述来组建一块虚拟的积木
        generator.brickList.forEach(function(brick) {
          if (!brick) {
            return true;
          }
          var desc = brick.shapeDesc;

          // 检查剩余的积木里是否还有一块能放进娱乐场，只要还有一块能够放进去，就还不算输
          for (var i = 1, descLen = desc.length; i < descLen; i++) {
            var relX = x - (desc[0].x - desc[i].x),
              relY = y - (desc[0].y - desc[i].y);

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
