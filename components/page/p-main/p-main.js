'use strict';

var Page = require('c-page');
var page = new Page({
  tpl: __inline('p-main.html')
});

page.show = function(state) {

};

page.hide = function() {
  
};

module.exports = page;