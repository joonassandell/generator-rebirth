'use strict';

var relative = require('relative-dest');

module.exports = function assets() {
  var view = this.context.view;
  var dest = view.data.dest || view.path;
  var assets = this.context.assets || '';
  var base = relative(dest, assets);
  var path = base.replace(/..\/..\//, './');
  return path;
};
