'use strict';

var Page = require('c-page');
var page = new Page({
  tpl: __inline('p-main.html')
});

page.load = function() {
  require('canvasImg/c-crown').initialize();
  require('canvasImg/c-setting').initialize();

  var settingArea = document.querySelector('#p-main .setting-area');

  document.querySelector('#p-main .c-setting.btn').addEventListener('click', function() {
    settingArea.classList.add('scrollUp');
  });

  document.querySelector('#p-main .setting-area .back.btn').addEventListener('click', function() {
    settingArea.classList.remove('scrollUp');
  });
};

page.show = function() {
  // localStorage.getItem('')
  // todo
};

page.hide = function() {};

module.exports = page;