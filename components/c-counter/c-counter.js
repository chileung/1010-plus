/* 计分器 extend Container
  public properties:
    int score : 分数

  public methods:
    add(score)    : 增加分数
    subtract(score) : 减少分数
*/
var Counter = Container.subClass({
  init: function() {
    this._super();

    var score = 0;
    var that = this;
    var text = new createjs.Text(score, config.fontSize + 'px Microsoft Yahei', '#ff7700');

    Object.defineProperties(this, {
      score: {
        get: function() {
          return score;
        },
        set: function(value) {
          if (typeof value !== 'number') {
            return false;
          }

          var i = score;

          score = value;

          (function next() {
            text.text = i++;

            if (i <= score) {
              setTimeout(next, 50);
            }
          })();
        }
      }
    });

    this.container.addChild(text);
  },
  add: function(score) {
    if (typeof score !== 'number' || score < 0) {
      return false;
    }
    this.score += score;
  },
  subtract: function(score) {
    if (typeof score !== 'number' || score < 0) {
      return false;
    }
    this.score -= score;
  }
});