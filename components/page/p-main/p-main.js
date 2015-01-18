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
  require('canvasImg/i-logo').initialize();

  settingArea = document.querySelector('#p-main .setting-area');

  document.querySelector('#p-main .i-setting.btn').addEventListener('click', function() {
    settingArea.classList.add('scrollUp');
  });

  document.querySelector('#p-main .setting-area .back.btn').addEventListener('click', function() {
    settingArea.classList.remove('scrollUp');
  });
};

page.show = function() {
  var node = document.querySelector('#p-main .highest-score');
  node.innerHTML = localStorage.getItem('1010-p-hc') || 0;
};

page.hide = function() {
  settingArea.classList.remove('scrollUp');
};

module.exports = page;