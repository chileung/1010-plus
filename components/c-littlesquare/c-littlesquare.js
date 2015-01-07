/* 小正方类 extend DisplayObj
  init options:
    color : 一个表示颜色值的字符串 
*/
var LittleSquare = DisplayObj.subClass({
  init: function(options) {
    this._super(options);
    this.color = options && options.color || config.color;
    this.width = config.size;
    this.height = config.size;

    // initialize shape
    var PI = Math.PI;
    var r = config.radius;

    this.shape.graphics
      .beginStroke(this.color)
      .beginFill(this.color)
      .moveTo(0, r)
      .lineTo(0, this.height - r * 2)
      .arc(r, this.height - r, r, -PI, PI / 2, true)
      .lineTo(this.width - r, this.height)
      .arc(this.width - r, this.height - r, r, PI / 2, 0, true)
      .lineTo(this.width, r)
      .arc(this.width - r, r, r, 0, -PI / 2, true)
      .lineTo(r, 0)
      .arc(r, r, r, -PI / 2, PI, true);
  }
});