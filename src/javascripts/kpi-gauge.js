var dc = require('dc');

require('../../src/stylesheets/kpi-gauge.scss');

var KPIGauge = function(parent, dimension, group, options) {

  var _chart = {kpiBar: {}, kpiNumber: {}};
  var gaugeClassName = 'kpi-gauge';
  var numberClassName = 'kpi-number';
  var formatter = d3.format(",");
  var title = "Total";
  var barWidth = function () {return d3.select(parent).property('offsetWidth')};
  var barHeight = 9;
  
  if(options) {
    if(options.formatter) {
      formatter = options.formatter;
    }

    if(options.title) {
      title = options.title;
    }

    if(options.width) {
      width = options.width;
    }

    if(options.height) {
      height = options.height;
    }

  }

	var root = d3.select(parent);
  root.classed('kpi-component-container', true);
	
	root.append('div').classed(gaugeClassName, true);
	root.append('div').classed(numberClassName, true);
  root.append('h3').html(title);

	_chart.kpiNumber = dc.numberDisplay(parent + ' .' + numberClassName)
      .group(group)
      .valueAccessor(function(d) { return d;})
      .formatNumber(formatter);

  _chart.kpiBar = dc.barGauge(parent + ' .' + gaugeClassName)
    .width(barWidth())
    .height(barHeight)
    .orientation('horizontal')
    .margins({top:0,right:0,bottom:0,left:0})
    .usePercentageLength(true)
    .dimension(dimension)
    .group(group)
    .totalCapacity(group.value());

  resize = function() {
    _chart.kpiBar.width(barWidth()).render();
  };

  window.addEventListener('resize', resize, true);

  return _chart;
};

module.exports = KPIGauge;