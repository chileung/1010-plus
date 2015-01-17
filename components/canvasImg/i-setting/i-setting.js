'use strict';

var CanvasImg = require('canvasImg/i-canvasImg');

var Setting = CanvasImg.subClass({
  width: 50,
  height: 50,
  // overwrite
  draw: function() {
    var ctx = this.node.getContext('2d');
    var color = '#67C2E4';
    var g = new createjs.Graphics();
    
    g.s(color)
      .f(color)
      .dc(25, 25, 20)
      .s('#fff')
      .f('#fff')
      .dc(25, 25, 15);

    g.draw(ctx);

    var cos = Math.cos;
    var sin = Math.sin;
    var PI = Math.PI;

    for (var r = 0; r < 2 * PI; r += 2 * PI / 8) {
      g = new createjs.Graphics();
      g.s(color).f(color).dc(20 * cos(r) + 25, 20 * sin(r) + 25, 5);
      g.draw(ctx);
    }
  }
});

module.exports = new Setting('i-setting');