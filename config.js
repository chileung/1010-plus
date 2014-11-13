// 基础配置
(function(that) {
    var myStage = new createjs.Stage('myCanvas');
    that.config = {
        mapSize: 10,
        size: parseInt(myStage.canvas.width / 12),
        randomCount: 3,
        canvasElm: 'myCanvas',
        color: 'red',
        stage: myStage,
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
})(window);
createjs.Touch.enable(config.stage);
createjs.Ticker.setFPS(75);
createjs.Ticker.addEventListener('tick', config.stage);