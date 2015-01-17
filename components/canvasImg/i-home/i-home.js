'use strict';

var CanvasImg = require('canvasImg/i-canvasImg');

var Home = CanvasImg.subClass({
  width: 70,
  height: 70,
  // overwrite
  draw: function() {
    var ctx = this.node.getContext('2d');
    var g = new createjs.Graphics();
    var color = '#67C2E4';

    g.f(color)
      .rr(0, 0, 70, 70, 8)
      .f('#fff').s('#fff')
      .ss(5, 'round', 'round')
      .mt(35, 5)
      .lt(65, 35)
      .lt(5, 35)
      .lt(35, 5)
      .mt(17, 10)
      .lt(17, 35)
      .es()
      .rr(10, 40, 50, 30, 8)
      .draw(ctx);
  }
});

module.exports = new Home('i-home');