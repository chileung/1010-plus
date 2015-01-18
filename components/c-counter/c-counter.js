'use strict';

var config = require('config');
var Container = require('c-container');

/* 计分器
  [PROPERTIES]
    score : 当前分数

  [METHODS]
    add(score)      : 增加分数
    subtract(score) : 减少分数
*/

module.exports = Container.subClass({
  init: function() {
    this._super();

    var score = 0;
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

    var hc = localStorage.getItem('1010-p-hc');

    var hc = (isNaN(hc) || !!!hc) ? 0 : parseInt(hc);

    localStorage.setItem('1010-p-hc', hc < this.score ? this.score : hc);
  },
  subtract: function(score) {
    if (typeof score !== 'number' || score < 0) {
      return false;
    }
    this.score -= score;
  }
});