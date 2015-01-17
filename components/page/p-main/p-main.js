'use strict';

var Page = require('c-page');
var page = new Page({
  tpl: __inline('p-main.html')
});

var settingArea = null;

page.load = function() {
  require('canvasImg/i-trophy').initialize();
  require('canvasImg/i-setting').initialize();
  require('canvasImg/i-start').initialize();
  require('canvasImg/i-back').initialize();
  require('canvasImg/i-fork').initialize();

  settingArea = document.querySelector('#p-main .setting-area');

  document.querySelector('#p-main .i-setting.btn').addEventListener('click', function() {
    settingArea.classList.add('scrollUp');
  });

  document.querySelector('#p-main .setting-area .back.btn').addEventListener('click', function() {
    settingArea.classList.remove('scrollUp');
  });
};

page.show = function() {
  // localStorage.getItem('')
  // html中的Logo图片还没弄
  // todo
};

page.hide = function() {
  settingArea.classList.remove('scrollUp');
};

module.exports = page;