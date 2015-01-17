'use strict';

var CanvasImg = require('canvasImg/i-canvasImg');

var Fork = CanvasImg.subClass({
  width: 70,
  height: 70,
  // overwrite
  draw: function() {
    var ctx = this.node.getContext('2d');
    var g = new createjs.Graphics();
    var color = '#67C2E4';

    g.s('#fff')
      .ss(8, 'round', 'round')
      .mt(18, 5)
      .lt(18, 20)
      .mt(35, 5)
      .lt(35, 20)      
      .mt(52, 5)
      .lt(52, 20)
      .f('#fff')
      .a(35, 20, 17, Math.PI, 0, true)
      .ss(15, 'round', 'round')
      .mt(35, 45)
      .lt(35, 60)
      .mt(18 + 17 / 2, 20)
      .ss(1)
      .s(color)
      .f(color)
      .a(26, 20, 4, Math.PI, 0, true)
      .mt(44, 20)
      .a(43, 20, 4, Math.PI, 0, true)
      .draw(ctx);
  }
});

module.exports = new Fork('i-fork');