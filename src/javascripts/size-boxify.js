var dc = require('./tool-tipsify')();

// styles
require('../../src/stylesheets/size-boxify.scss');

var sizeBoxify = function() {
  var original = {};

  original.rowChart = dc.rowChart;
  dc.rowChart = function(parent, opts) {
    var _chart = original.rowChart(parent);

    _chart = sizeBoxifyMixin(_chart); 

    _chart.resize = function() {
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
    var _innerRadiusRatio = (opts && opts.innerRadiusRatio && typeof opts.innerRadiusRatio === "number") ? opts.innerRadiusRatio : 13/20;
    _chart = sizeBoxifyMixin(_chart);

    _chart.getDynamicRadius = function() {
      if(_chart.getDynamicHeight() < _chart.getDynamicWidth())
        return _chart.getDynamicHeight()/2;
      else
        return _chart.getDynamicWidth()/2;
    };

    _chart.getInnerRadius = function() {

      return _chart.getDynamicRadius() * _innerRadiusRatio;
    };

    _chart.resize = function() {
      _chart.height(_chart.getDynamicHeight()).width(_chart.getDynamicWidth())
        .innerRadius(_chart.getInnerRadius()).radius(_chart.getDynamicRadius())
        .cx(_chart.getDynamicRadius())
        .legend(dc.legend().x((_chart.getDynamicRadius() * 2) + 10).y(12).itemHeight(12).gap(2))
        .render();
    };

    window.addEventListener('resize', _chart.resize, true);

    _chart.width(_chart.getDynamicWidth()).height(_chart.getDynamicHeight())
      .innerRadius(_chart.getInnerRadius()).radius(_chart.getDynamicRadius())
      .cx(_chart.getDynamicRadius())
      .legend(dc.legend().x((_chart.getDynamicRadius() * 2) + 10).y(12).itemHeight(12).gap(2));
    return _chart;
  };

  original.barChart = dc.barChart;
  dc.barChart = function(parent, opts) {
    var _chart = original.barChart(parent);

    _chart = sizeBoxifyMixin(_chart);

    _chart.resize = function() {
      _chart.width(_chart.getDynamicWidth())
        .height(_chart.getDynamicHeight())
        .rescale();
      _chart.render();
      _chart.redraw(); //must also redraw so filters are preserved
    };

    window.addEventListener('resize', _chart.resize, true);

    _chart.width(_chart.getDynamicWidth()).height(_chart.getDynamicHeight());
    return _chart;
  };

  original.geoChoroplethChart = dc.geoChoroplethChart;
  dc.geoChoroplethChart = function(parent, opts) {
    var _chart = original.geoChoroplethChart(parent, opts);
    var projectionWidth = 960;

    _chart = sizeBoxifyMixin(_chart);

    _chart.getProjectionScale = function() {
      return (_chart.getDynamicWidth()/projectionWidth) * 153;
    };

    _chart.getProjection = function() {
      return d3.geo.mercator().scale(_chart.getProjectionScale()).translate([_chart.getDynamicWidth()/2, _chart.getDynamicHeight()/2]);
    };

    _chart.resize = function() {
      _chart.width(_chart.getDynamicWidth())
        .height(_chart.getDynamicHeight())
        .projection(_chart.getProjection())
        .render();
    };

    window.addEventListener('resize', _chart.resize, true);

    _chart.width(_chart.getDynamicWidth()).height(_chart.getDynamicHeight())
      .projection(_chart.getProjection());
    return _chart;
  };

  original.geoBubbleOverlayChart = dc.geoBubbleOverlayChart;
  dc.geoBubbleOverlayChart = function(parent, opts) {
    var _chart = original.geoBubbleOverlayChart(parent, opts);
    var projectionWidth = 960;

    _chart = sizeBoxifyMixin(_chart);

    _chart.getProjectionScale = function() {
      return (_chart.getDynamicWidth()/projectionWidth) * 153;
    };

    _chart.getProjection = function() {
      return d3.geo.mercator().scale(_chart.getProjectionScale()).translate([_chart.getDynamicWidth()/2, _chart.getDynamicHeight()/2]);
    };

    _chart.resize = function() {
      _chart.width(_chart.getDynamicWidth())
        .height(_chart.getDynamicHeight())
        .projection(_chart.getProjection())
        .render();
    };

    window.addEventListener('resize', _chart.resize, true);

    _chart.width(_chart.getDynamicWidth()).height(_chart.getDynamicHeight())
      .projection(_chart.getProjection());
    return _chart;
  };

  return dc;
};

var sizeBoxifyMixin = function(chart) {

  var container = chart.root()[0][0];
  chart.root().classed('size-boxified', true);

  chart.getDynamicHeight = function() {
      return container.offsetHeight;
    };

  chart.getDynamicWidth = function() {
    return container.offsetWidth;
  };

  return chart;
}

module.exports = sizeBoxify;



