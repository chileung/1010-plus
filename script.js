// 随机积木生成器
var RandomBrickGenerator = Container.subClass({
	init: function() {
		this._super();
	},
	random: function() {
		// todo
		// 生成一个随机形状的积木
	}
});



// main
var playground = new Kursaal();

var demo1 = new VerticalLine2();
var demo2 = new VerticalLine2();

demo2.move(100, 0);

demo1.setOut();
demo2.setOut();

demo1.setKursaal(playground);
demo2.setKursaal(playground);

demo1.config.enableMoving = true;
demo2.config.enableMoving = true;

// playground.update();