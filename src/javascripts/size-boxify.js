var dc = require('dc');

// styles
require('../../src/stylesheets/size-boxify.scss');

require('font-awesome/css/font-awesome.css');
require('../../src/stylesheets/common.scss');
require('normalize.css/normalize.css');

var sizeBoxify = function(dc) {
  var original = {};

  original.rowChart = dc.rowChart;
  dc.rowChart = function(parent, opts) {
    var _chart = original.rowChart(parent);

    _chart.sizeBoxify();

    return _chart;
  };


  return dc;
};

module.exports = sizeBoxify;