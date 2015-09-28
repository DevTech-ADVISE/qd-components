var inflection = require('inflection'),
  dtip = require('d3-tip')(d3);

var quickDefaults = function(dc) {
  
  var original = {};

  original.rowChart = dc.rowChart;
  dc.rowChart = function(parent, opts) {
    var _chart = original.rowChart(parent);

    _chart.elasticX(true);

    return _chart;
  };


  original.geoChoroplethChart = dc.geoChoroplethChart;
  dc.geoChoroplethChart = function(parent, opts) {
    var _chart = original.geoChoroplethChart(parent);
    //Defaults for colors and data
    var _colorRange = ["#a9c8f4", "#7fa1d2", "#5479b0", "#2a518e", "#002A6C"];
    var _zeroColor = '#ccc';
    var _colorDomain = [100, 60000];

    _chart.colors(d3.scale.quantize().range(_colorRange))
      .colorDomain(_colorDomain)
      .colorCalculator(function (d) {
        if(d === undefined) return _zeroColor;
        if(d < 1 )return _zeroColor;
        return _chart.colors()(Math.sqrt(d)); 
      })
      .projection(d3.geo.mercator())
      .enableZoom(true)
      .afterZoom(function(g, s){
        g.selectAll('.country').selectAll('path').style('stroke-width',0.75 / s + 'px');
      });

    return _chart;
  };

  return dc;
};

module.exports = quickDefaults;