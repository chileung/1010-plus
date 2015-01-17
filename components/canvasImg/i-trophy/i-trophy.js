'use strict';

var CanvasImg = require('canvasImg/i-canvasImg');

var Trophy = CanvasImg.subClass({
  width: 50,
  height: 50,
  // overwrite
  draw: function() {
    var ctx = this.node.getContext('2d');
    var color = '#67C2E4';

    var g = new createjs.Graphics();

    g.s(color).ss(1, 'round', 'round')
      .mt(9, 0)
      .lt(0, 0)
      .qt(5, 30, 15, 30)
      .mt(41, 0)
      .lt(50, 0)
      .qt(45, 30, 35, 30)
      .mt(12, 0)
      .lt(38, 0)
      .f(color)
      .mt(12, 0)
      .qt(15, 35, 25, 35)
      .lt(25, 0)
      .mt(38, 0)
      .qt(35, 35, 25, 35)
      .lt(25, 0)
      .f('#fff')
      .dp(25, 15, 6, 5, 0.4, -90)
      .f(color)
      .a(25, 50, 10, Math.PI, 0, false)
      .draw(ctx);
  }
});

module.exports = new Trophy('i-trophy');