'use strict';

/*
  c-page.js
    A simple module that makes your Web app supports SPA(Single Page Application).
  Author: chileung
  Date: 2015.1.11
*/

function showRoot(self) {
  if (self.root) {
    self.root.style.display = 'block';
  }
}

function hideRoot(self) {
  if (self.root) {
    self.root.style.display = 'none';
  }
}

// Page Class
// Note: Each page in your Web app is an instance of Page. 
var Page = function(options) {
  var self = this;

  // Root property refer to the root DOM node of the current page.
  self.root = null;
  // The property ensures your page will only insert into body once.
  self.loaded = false;

  // Handler queue of show, hide & load 
  var showFnList = [];
  var hideFnList = [];
  var loadFnList = [];

  /* Note: 
      Each page has three methods which will be invoked at the specific time.
      When the new page is going to be shown, the "show" method of the new page will be invoked,
    as well as the "hide" method of the current page which will be hidden, will be invoked. Note 
    that if the new page has not been initialized and inserted into body, the load method will be 
    invoked before the show method and only invoked once.
  */

  Object.defineProperties(self, {
    show: {
      get: function() {
        return function(state) {
          // assume that load function must be invoked at first.
          self.load.call(self, state);

          // invoke all of the functions queuqed in the showFnList queue.
          showFnList.forEach(function(fn) {
            fn.call(self, self);
          });

          // invoke showRoot function as the last step.
          showRoot.call(self, self);
        };
      },
      set: function(fn) {
        showFnList.push(fn);
      }
    },
    hide: {
      get: function() {
        return function(state) {
          // invoke hideRoot function first.
          hideRoot.call(self, self);

          hideFnList.forEach(function(fn) {
            fn.call(self, state);
          });
        };
      },
      set: function(fn) {
        hideFnList.push(fn);
      }
    },
    load: {
      get: function() {
        return function(state) {
          if (!self.loaded) {
            self.root = document.createElement('section');
            self.root.innerHTML = options && options.tpl || '';
            document.querySelector('body').appendChild(self.root);

            loadFnList.forEach(function(fn) {
              fn.call(self, state);
            });

            // ensures that the load method of the page will only invoked once.
            self.loaded = true;
          }
        };
      },
      set: function(fn) {
        loadFnList.push(fn);
      }
    }
  });
};

module.exports = Page;