// 基础配置
var config = {
	mapSize: 10,
	size: 50,
	randomCount: 3,
	color: 'red',
	canvasElm: 'myCanvas',
	stage: new createjs.Stage('myCanvas'),
	shapes: {
		point1: '[{"x": 0, "y": 0}]',
		verticalLine2: '[{"x": 0, "y": 0}, {"x": 0,"y": 1}]',
		horizontalLine2: '[{"x": 0, "y": 0}, {"x": 1,"y": 0}]',
		leftTopL3: '[{"x": 0, "y": 0}, {"x": 0, "y": 1}, {"x": 1, "y": 0}]',
		leftBottomL3: '[{"x": 0, "y": 0}, {"x": 0, "y": 1}, {"x": 1, "y": 1}]',
		rightTopL3: '[{"x": 0, "y": 0}, {"x": 1, "y": 0}, {"x": 1, "y": 1}]',
		rightBottomL3: '[{"x": 1, "y": 0}, {"x": 1, "y": 1}, {"x": 0, "y": 1}]',
		verticalLine3: '[{"x": 0, "y": 0}, {"x": 0, "y": 1}, {"x": 0, "y": 2}]',
		horizontalLine3: '[{"x": 0, "y": 0}, {"x": 1, "y": 0}, {"x": 2, "y": 0}]',
		square4: '[{"x": 0, "y": 0}, {"x": 0, "y": 1}, {"x": 1, "y": 0}, {"x": 1, "y": 1}]',
		verticalLine4: '[{"x": 0, "y": 0}, {"x": 0, "y": 1}, {"x": 0, "y": 2}, {"x": 0, "y": 3}]',
		horizontalLine4: '[{"x": 0, "y": 0}, {"x": 1, "y": 0}, {"x": 2, "y": 0}, {"x": 3, "y": 0}]',
		verticalLine5: '[{"x": 0, "y": 0}, {"x": 0, "y": 1}, {"x": 0, "y": 2}, {"x": 0, "y": 3}, {"x": 0, "y": 4}]',
		horizontalLine5: '[{"x": 0, "y": 0}, {"x": 1, "y": 0}, {"x": 2, "y": 0}, {"x": 3, "y": 0}, {"x": 4, "y": 0}]'
	}
};