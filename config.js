// 基础配置
(function(that) {
    var myStage = new createjs.Stage('myCanvas');
    that.config = {
        mapSize: 10,
        size: parseInt(myStage.canvas.width / 15),
        randomCount: 3,
        canvasElm: 'myCanvas',
        colorList: ['#67C2E4', '#7EDEC2', '#E17167', '#FEC54C', '#E77B91', '#B1E385', '#EEA46A', '#8091D4'],
        stage: myStage,
        gap: 2.5,
        bgColor: '#EBEBEB',
        radius: 4,
        scaleDown: 0.7,
        scaleUp: 1.1,
        moveUp: 50,
        fontSize: 20,
        shapes: {
            point1: '[{"x": 2, "y": 2}]',
            verticalLine2: '[{"x": 2, "y": 2}, {"x": 2,"y": 3}]',
            horizontalLine2: '[{"x": 2, "y": 2}, {"x": 3,"y": 2}]',
            leftTopL3: '[{"x": 2, "y": 2}, {"x": 2, "y": 3}, {"x": 3, "y": 2}]',
            leftBottomL3: '[{"x": 2, "y": 2}, {"x": 3, "y": 2}, {"x": 2, "y": 1}]',
            rightTopL3: '[{"x": 2, "y": 2}, {"x": 2, "y": 3}, {"x": 1, "y": 2}]',
            rightBottomL3: '[{"x": 2, "y": 2}, {"x": 2, "y": 1}, {"x": 1, "y": 2}]',
            verticalLine3: '[{"x": 2, "y": 2}, {"x": 2, "y": 3}, {"x": 2, "y": 1}]',
            horizontalLine3: '[{"x": 2, "y": 2}, {"x": 1, "y": 2}, {"x": 3, "y": 2}]',
            
            square4: '[{"x": 2, "y": 2}, {"x": 2, "y": 3}, {"x": 3, "y": 2}, {"x": 3, "y": 3}]',
            verticalLine4: '[{"x": 2, "y": 2}, {"x": 2, "y": 3}, {"x": 2, "y": 4}, {"x": 2, "y": 1}]',
            horizontalLine4: '[{"x": 2, "y": 2}, {"x": 1, "y": 2}, {"x": 3, "y": 2}, {"x": 4, "y": 2}]',

            verticalLine5: '[{"x": 2, "y": 0}, {"x": 2, "y": 1}, {"x": 2, "y": 2}, {"x": 2, "y": 3}, {"x": 2, "y": 4}]',
            horizontalLine5: '[{"x": 0, "y": 2}, {"x": 1, "y": 2}, {"x": 2, "y": 2}, {"x": 3, "y": 2}, {"x": 4, "y": 2}]',

            leftTopL5: '[{"x": 1, "y": 1}, {"x": 1, "y": 2}, {"x": 1, "y": 3}, {"x": 2, "y": 1}, {"x": 3, "y": 1}]',
            leftBottomL5: '[{"x": 1, "y": 3}, {"x": 1, "y": 2}, {"x": 1, "y": 1}, {"x": 2, "y": 3}, {"x": 3, "y": 3}]',
            rightTopL5: '[{"x": 3, "y": 1}, {"x": 3, "y": 2}, {"x": 3, "y": 3}, {"x": 2, "y": 1}, {"x": 1, "y": 1}]',
            rightBottomL5: '[{"x": 3, "y": 3}, {"x": 3, "y": 2}, {"x": 3, "y": 1}, {"x": 2, "y": 3}, {"x": 1, "y": 3}]',

            square9: '[{"x": 2, "y": 2}, {"x": 1, "y": 1}, {"x": 2, "y": 1}, {"x": 3, "y": 1}, {"x": 1, "y":2 }, {"x": 3, "y": 2}, {"x": 1, "y": 3}, {"x": 2, "y": 3}, {"x": 3, "y": 3}]'
        }
    };
})(window);
createjs.Touch.enable(config.stage);
createjs.Ticker.setFPS(75);
createjs.Ticker.addEventListener('tick', config.stage);