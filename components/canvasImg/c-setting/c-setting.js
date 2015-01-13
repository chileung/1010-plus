'use strict';

var CanvasImg = require('canvasImg/c-canvasImg');

var Setting = CanvasImg.subClass({
  width: 50,
  height: 50,
  // overwrite
  draw: function() {
    var ctx = this.node.getContext('2d');
    var color = 'gray';

    var g = new createjs.Graphics();
    g.s(color)
      .f(color)
      .dc(25, 25, 15)
      .s('#fff')
      .f('#fff')
      .dc(25, 25, 10);

    g.draw(ctx);

    var cos = Math.cos;
    var sin = Math.sin;
    var PI = Math.PI;

    for (var r = 0; r < 2 * PI; r += 2 * PI / 8) {
      g = new createjs.Graphics();
      g.s(color).f(color).dc(15 * cos(r) + 25, 15 * sin(r) + 25, 3);
      g.draw(ctx);
    }
  }
});

module.exports = new Setting('c-setting');