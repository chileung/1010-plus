'use strict';

var CanvasImg = require('canvasImg/i-canvasImg');

var Logo = CanvasImg.subClass({
  width: 130,
  height: 50,
  // overwrite
  draw: function() {
    var ctx = this.node.getContext('2d');
    var g = new createjs.Graphics();

    g.ss(5, 'round', 'round')
      .s('#67C2E4')
      .mt(5,15)
      .lt(5,35)
      .es()
      .s('#7EDEC2')
      .dc(25, 25, 10)
      .es()
      .s('#E17167')
      .mt(45, 15)
      .lt(45, 35)
      .es()
      .s('#FEC54C')
      .dc(65, 25, 10)
      .es()
      .s('#E77B91')
      .mt(85, 15)
      .lt(85, 27)
      .mt(85, 40)
      .f('#E77B91')
      .dc(85, 35, 1)
      .es()
      .ef()
      .s('#B1E385')
      .mt(95, 25)
      .lt(103, 25)
      .es()
      .s('#EEA46A')
      .mt(113, 22)
      .lt(113, 45)
      .mt(120, 25)
      .es()
      .s('#EEA46A')
      .dc(120, 25, 7)
      .draw(ctx);
  }
});

module.exports = new Logo('i-logo');