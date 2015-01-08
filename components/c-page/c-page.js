'use strict';

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

var Page = function(options) {
  var self = this;

  self.root = null;
  self.loaded = false;

  // handler queue of show, hide & load 
  var showFnList = [];
  var hideFnList = [];
  var loadFnList = [];

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