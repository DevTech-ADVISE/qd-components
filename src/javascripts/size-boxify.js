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
    var container = d3.select(parent).node().parentNode;
    var getDynamicHeight = function() {
      console.log(container.offsetHeight)
      return container.offsetHeight;
    };

    var getDynamicWidth = function() {
      return container.offsetWidth;
    };

    var resize = function() {
      _chart.height(getDynamicHeight())
        .width(getDynamicWidth())
        .render();

      console.log("test");
    };

    d3.select(window).on('resize', resize);

    return _chart;
  };

  return dc;
};


module.exports = sizeBoxify;