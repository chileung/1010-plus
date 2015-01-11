'use strict';

/* 部分图片使用canvas绘制，因此将逻辑进行抽象
   约定：
    1. 使用canvas标签，且必须带有属性值为"false"的data-init属性
    2. 继承该类的子类必须声明一个className属性，属性值为子类图片所特有的一个HTML类名
    3. 子类需要重写父类的draw方法，以描绘自己的形状
    4. 子类实例化后，调用initialize()方法，即可在dom中绘制图片
*/

module.exports = Object.subClass({
  initialize: function() {
    var nodes = document.querySelectorAll('canvas[data-init="false"].' + (this.className || ''));

    for (var i = 0, l = nodes.length; i < l; i++) {
      this.node = nodes[i];
      this.draw();
      this.node.dataset.init = 'true';
    }
  },
  draw: function() {
    // 该方法用于被子类重写
  }
});