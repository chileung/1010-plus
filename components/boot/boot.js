'use strict';

module.exports = function() {
	require.async('page', function(page) {
		page.start('p-main');
	});
};