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
    var container = d3.select(parent)[0][0];//.node().parentNode;
    _chart.getDynamicHeight = function() {
      return container.offsetHeight;
    };

    _chart.getDynamicWidth = function() {
      return container.offsetWidth;
    };

    var resize = function() {
      console.log(_chart.getDynamicHeight())
      _chart.height(_chart.getDynamicHeight())
        .width(_chart.getDynamicWidth())
        .render();

    };

    window.addEventListener('resize', resize, true);

    _chart.width(_chart.getDynamicWidth()).height(_chart.getDynamicHeight());
    return _chart;
  };

  original.pieChart = dc.pieChart;
  dc.pieChart = function(parent, opts) {
    var _chart = original.pieChart(parent);
    var container = d3.select(parent)[0][0];//.node().parentNode;

    _chart.getDynamicHeight = function() {
      return container.offsetHeight;
    };

    _chart.getDynamicWidth = function() {
      return container.offsetWidth;
    };

    _chart.getInnerRadius = function() {
      return (_chart.getDynamicHeight()/2) * (3/5);
    };

    _chart.getOuterRadius = function() {
      return (_chart.getDynamicHeight()/2);
    };

    var resize = function() {
      _chart.innerRadius(_chart.getInnerRadius())
        .radius(_chart.getOuterRadius())
        .height(_chart.getDynamicHeight())
        .render();
    };

    window.addEventListener('resize', resize, true);

    _chart.width(_chart.getDynamicWidth()).height(_chart.getDynamicHeight())
      .innerRadius(_chart.getInnerRadius()).radius(_chart.getOuterRadius());
    return _chart;
  };

  original.barChart = dc.barChart;
  dc.barChart = function(parent, opts) {
    var _chart = original.barChart(parent);
    var container = d3.select(parent)[0][0];//.node().parentNode;

    _chart.getDynamicHeight = function() {
      return container.offsetHeight;
    };

    _chart.getDynamicWidth = function() {
      return container.offsetWidth;
    };

    var resize = function() {
      _chart.width(_chart.getDynamicWidth())
        .height(_chart.getDynamicHeight())
        .render();
    };

    window.addEventListener('resize', resize, true);

    _chart.width(_chart.getDynamicWidth()).height(_chart.getDynamicHeight());
    return _chart;
  };

  return dc;
};


module.exports = sizeBoxify;