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
      //get the chart data object whose key matches the geojson feature id
      var matchingDataItem = _chart.data().filter(function(i){return i.key === d.id})[0];
      var countryName = _chart.label()({key: d.id, value: undefined}); 

      //if the chart has data for this geojson feature id, return its value in the tooltip content
      if(matchingDataItem) {
        return "<label>" + countryName + "</label><br/>" + formatter(_chart.valueAccessor()(matchingDataItem));
      }

      return "<label>" + countryName + "</label><br/>No Data";
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

  var _legendToolTips = false;
  var _extraToolTips = [];
  var _position = 'mouse';
  var _d3TipClass = 'd3-tip';
  var _offset = [0, 0]; 
  var _toolTipFormatter = d3.format(",");
  var _toolTipContent = function(d) {
    var label = (chart.label()(d) !== undefined) ? chart.label()(d) : chart.label()(d.data);
    var value = (d.value !== undefined) ? d.value : d.data.value;
    return "<label>" + label + "</label><br/>" + _toolTipFormatter(value);
  };

  chart.legendToolTips = function(_) {
    if(!arguments.length) return _legendToolTips;
    _legendToolTips = _;
    chart.legendContent(function(legendable) { return legendable.label;});
    _extraToolTips = [{content: chart.legendContent(), formatter: chart.legendFormatter(), selector: "g.dc-legend-item"}];
    return chart;
  };

  chart.extraToolTips = function(_) {
    if(!arguments.length) return _extraToolTips;
    _extraToolTips = _;
    return chart;
  };
  
  chart.toolTipContent = function(_) {
    if(!arguments.length) return _toolTipContent;
    _toolTipContent = _;
    return chart;
  };

  chart.toolTipFormatter = function(_) {
    if(!arguments.length) return _toolTipFormatter;
    _toolTipFormatter = _;
    return chart;
  };

  chart.toolTipsify = function(options){
    // default & override setup for formatter
    if (options && options.formatter) {
      _toolTipFormatter = options.formatter;
    }

    // override content and position via options
    if (options && options.content) {
      _toolTipContent = options.content;
    }
    if (options && options.position) {
      _position = options.position;
    }
    if(options && options.offset) {
      _offset = options.offset;
    }
    
    
    if (_position === 'mouse') {
      _d3TipClass = 'd3-tip-mouse';
    }

    chart.renderlet(function(){
      var ttId = chart.root().attr('id') + '-tip';

      var tt = d3.tip()
        .attr('class', _d3TipClass)
        .attr('id', ttId)
        .html(_toolTipContent)
        .offset(_offset);

      if (_position === 'mouse') {
        tt.positionAnchor(_position)
      }
      else {
        tt.direction(_position);
      }

      var tippables = chart.selectAll(tippableSelector); 

      // HACK...
      if (!d3.select('#' + ttId).empty()) d3.select('#' + ttId).remove(); 

      tippables.call(tt);
      tippables.on('mouseover', tt.show)
               .on('mouseout', tt.hide);
      if(_position === 'mouse') {
        tippables.on('mousemove', tt.updatePosition);
      }

      //Add any extra tool tips
      if(_legendToolTips === true || Object.keys(_extraToolTips).length > 0) {
        chart.addExtraToolTips();
      }
    });
  };

  chart.addExtraToolTips = function() {
    _extraToolTips.forEach(function(t, index) {
      var position = t.position || _position;
      var offset = t.offset || _offset;
      var selector = t.selector;
      var formatter = t.formatter || _toolTipFormatter;
      var content = t.content || function(d) {
        var label = (chart.label()(d) !== undefined) ? chart.label()(d) : chart.label()(d.data);
        var value = (d.value !== undefined) ? d.value : d.data.value;
        return "<label>" + label + "</label><br/>" + formatter(value);
      } || _toolTipContent;

      //Add unique id for tooltip
      var ttId = chart.root().attr('id') + '-tip-' + index;

      var tt = d3.tip()
        .attr('class', _d3TipClass)
        .attr('id', ttId)
        .html(content)
        .offset(offset);

      if (position === 'mouse') {
        tt.positionAnchor(position)
      }
      else {
        tt.direction(position);
      }

      var tippables = chart.selectAll(selector); 

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