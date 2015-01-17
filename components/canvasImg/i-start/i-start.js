'use strict';

var CanvasImg = require('canvasImg/i-canvasImg');

var Start = CanvasImg.subClass({
  width: 70,
  height: 70,
  // overwrite
  draw: function() {
    var ctx = this.node.getContext('2d');
    var g = new createjs.Graphics();

    g.f('#B1E385')
      .rr(0, 0, 70, 70, 8)
      .f('#fff').s('#fff')
      .ss(5, 'round', 'round')
      .mt(24, 20)
      .lt(24, 50)
      .lt(46, 35)
      .lt(24, 20)
      .draw(ctx);
  }
});

module.exports = new Start('i-start');