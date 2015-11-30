var inflection = require('inflection'),
    dtip = require('d3-tip')(d3);
var formatters = require('qd-formatters')(d3);
var dc = require('./quick-defaults')();

require('../stylesheets/tool-tipsify.scss');

var addToolTipsifyToDc = function(){
  var original = {};
  
  original.rowChart = dc.rowChart;
  dc.rowChart = function(parent, opts) {
    var _chart = original.rowChart(parent, opts);
    _chart = toolTipsifyMixin(_chart, 'g.row');
    _chart.toolTipsify(opts);

    return _chart;
  };

  original.pieChart = dc.pieChart;
  dc.pieChart = function(parent, opts) {
    var _chart = original.pieChart(parent, opts);
    _chart = toolTipsifyMixin(_chart, 'g.pie-slice');
    _chart.toolTipsify(opts);

    return _chart;
  };

  original.barChart = dc.barChart;
  dc.barChart = function(parent, opts) {
    var _chart = original.barChart(parent, opts);
    _chart = toolTipsifyMixin(_chart, 'rect.bar');
    _chart.toolTipsify(opts);

    return _chart;
  };

  original.geoChoroplethChart = dc.geoChoroplethChart;
  dc.geoChoroplethChart = function(parent, opts) {
    var _chart = original.geoChoroplethChart(parent, opts);
    var formatter = formatters.bigNumberFormat;
    _chart = toolTipsifyMixin(_chart, 'g.country');

    if(opts && opts.formatter) {
      formatter = opts.formatter;
    }

    var geoChoroContent = function(d) {
      var dataItem = _chart.data().filter(function(i){return i.key === d.id})[0];
      var countryName = '';
      if(d.properties.name) {
        countryName = d.properties.name;
      }
      else if(dataItem) {
        countryName = _chart.label()(dataItem);
      }
      else {
        countryName = 'N/A';
      }
      if (dataItem === undefined) return "<label>" + countryName + "</label><br/>No Data";
      
      return "<label>" + countryName + "</label><br/>" + formatter(_chart.valueAccessor()(dataItem));
    }

    _chart.toolTipsify({content: geoChoroContent, formatter: formatter});

    return _chart;
  };

  original.geoBubbleOverlayChart = dc.geoBubbleOverlayChart;
  dc.geoBubbleOverlayChart = function(parent, opts) {
    var _chart = original.geoBubbleOverlayChart(parent, opts);
    var formatter = formatters.bigNumberFormat;
    _chart = toolTipsifyMixin(_chart, 'circle.bubble');

    if(opts && opts.formatter) {
      formatter = opts.formatter;
    }

    var geoBubbleContent = function(d) {
      var label = _chart.label()(d);
      return "<label>" + label + "</label><br/>" + formatter(d.value);
    }

    _chart.toolTipsify({content: geoBubbleContent, formatter: formatter, position: 's', offset: [10, 0]});

    return _chart;
  };

  return dc;
};

var toolTipsifyMixin = function(chart, tippableSelector){

  chart.toolTipsify = function(options){
    // default & override setup for formatter
    var formatter = d3.format(",");
    if (options && options.formatter) {
      formatter = options.formatter;
    }

    // default setup for content & position 
    var content = function(d) {
      var label = chart.label()(d) || chart.label()(d.data);
      var value = d.value || d.data.value;
      return "<label>" + label + "</label><br/>" + formatter(value);
    };
    var position = 'mouse';
    var offset = [0, 0]; 

    // override content and position via options
    if (options && options.content) {
      content = options.content;
    }
    if (options && options.position) {
      position = options.position;
    }
    if(options && options.offset) {
      offset = options.offset;
    }
    
    var d3TipClass = 'd3-tip';
    if (position === 'mouse') {
      d3TipClass = 'd3-tip-mouse';
    }

    chart.renderlet(function(){
      var ttId = chart.root().attr('id') + '-tip';

      var tt = d3.tip()
        .attr('class', d3TipClass)
        .attr('id', ttId)
        .html(content)
        .offset(offset);

      if (position === 'mouse') {
        tt.positionAnchor(position)
      }
      else {
        tt.direction(position);
      }

      var tippables = chart.selectAll(tippableSelector); 

      // HACK...
      if (!d3.select('#' + ttId).empty()) d3.select('#' + ttId).remove(); 

      tippables.call(tt);
      tippables.on('mouseover', tt.show)
               .on('mouseout', tt.hide);
      if(position === 'mouse') {
        tippables.on('mousemove', tt.updatePosition);
      }
    });
  };

  return chart;
};

module.exports = addToolTipsifyToDc;