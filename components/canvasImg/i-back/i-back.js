'use strict';

var CanvasImg = require('canvasImg/i-canvasImg');

var Back = CanvasImg.subClass({
  width: 50,
  height: 50,
  // overwrite
  draw: function() {
    var ctx = this.node.getContext('2d');
    var g = new createjs.Graphics();

    g.f('#67C2E4')
      .rr(0, 0, 50, 50, 8)
      .f('#fff').s('#fff')
      .ss(5, 'round', 'round')
      .mt(10, 20)
      .lt(40, 20)
      .lt(25, 40)
      .lt(10, 20)
      .draw(ctx);
  }
});

module.exports = new Back('i-back');