'use strict';

/* 部分图片使用canvas绘制，因此将逻辑进行抽象
   约定：
    1. 使用canvas标签，必须带有相应组件的类名
    2. 类实例化时必须传入一个className，作为子类图片所特有的一个HTML类名
    3. 子类继承时需要声明width和height属性
    3. 子类需要重写父类的draw方法，以描绘自己的形状
    4. 子类实例化后，调用initialize()方法，即可在dom中绘制图片
  
   TODO:
    抽象的程度还不足，当一个按钮有多种颜色的时候，抽象就会泄漏
*/

module.exports = Object.subClass({
  init: function(className) {
    this.className = className || '';
  },
  initialize: function() {  
    var nodes = document.querySelectorAll('canvas[class^=i-].' + (this.className || ''));

    for (var i = 0, l = nodes.length; i < l; i++) {
      this.node = nodes[i];
      this.node.setAttribute('width', this.width || 0);
      this.node.setAttribute('height', this.height || 0);
      this.draw();
      this.node.dataset.init = 'true';
    }
  },
  draw: function() {
    // 该方法用于被子类重写
  }
});