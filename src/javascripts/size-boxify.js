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
    d3.select(parent).classed("size-boxified", true);

    _chart.getDynamicHeight = function() {
      return container.offsetHeight;
    };

    _chart.getDynamicWidth = function() {
      return container.offsetWidth;
    };

    _chart.resize = function() {
      console.log(_chart.getDynamicWidth())
      _chart.height(_chart.getDynamicHeight())
        .width(_chart.getDynamicWidth())
        .render();

    };

    window.addEventListener('resize', _chart.resize, true);

    _chart.width(_chart.getDynamicWidth()).height(_chart.getDynamicHeight());
    return _chart;
  };

  original.pieChart = dc.pieChart;
  dc.pieChart = function(parent, opts) {
    var _chart = original.pieChart(parent);
    var container = d3.select(parent)[0][0];//.node().parentNode;
    d3.select(parent).classed("size-boxified", true);

    _chart.getDynamicHeight = function() {
      return container.offsetHeight;
    };

    _chart.getDynamicWidth = function() {
      return container.offsetWidth;
    };

    _chart.getDynamicRadius = function() {
      if(_chart.getDynamicHeight() < _chart.getDynamicWidth())
        return _chart.getDynamicHeight()/2;
      else
        return _chart.getDynamicWidth()/2;
    };

    _chart.getInnerRadius = function() {
      return _chart.getDynamicRadius() * (3/5);
    };

    _chart.resize = function() {
      _chart.height(_chart.getDynamicHeight()).width(_chart.getDynamicWidth())
        .innerRadius(_chart.getInnerRadius()).radius(_chart.getDynamicRadius())
        .render();
    };

    window.addEventListener('resize', _chart.resize, true);

    _chart.width(_chart.getDynamicWidth()).height(_chart.getDynamicHeight())
      .innerRadius(_chart.getInnerRadius()).radius(_chart.getDynamicRadius());
    return _chart;
  };

  original.barChart = dc.barChart;
  dc.barChart = function(parent, opts) {
    var _chart = original.barChart(parent);
    var container = d3.select(parent)[0][0];//.node().parentNode;
    d3.select(parent).classed("size-boxified", true);

    _chart.getDynamicHeight = function() {
      return container.offsetHeight;
    };

    _chart.getDynamicWidth = function() {
      return container.offsetWidth;
    };

    _chart.resize = function() {
      _chart.width(_chart.getDynamicWidth())
        .height(_chart.getDynamicHeight())
        .render();
    };

    window.addEventListener('resize', _chart.resize, true);

    _chart.width(_chart.getDynamicWidth()).height(_chart.getDynamicHeight());
    return _chart;
  };

  return dc;
};


module.exports = sizeBoxify;