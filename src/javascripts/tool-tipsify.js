var inflection = require('inflection'),
    dtip = require('d3-tip')(d3);

require('../stylesheets/tool-tipsify.scss');

var addToolTipsifyToDc = function(dc){
   var original = {};
  
  original.rowChart = dc.rowChart;
  dc.rowChart = function(parent, opts) {
    var _chart = original.rowChart(parent);
    _chart = toolTipsifyMixin(_chart, 'g.row');
    _chart.toolTipsify();

    return _chart;
  };

  original.pieChart = dc.pieChart;
  dc.pieChart = function(parent, opts) {
    var _chart = original.pieChart(parent);
    _chart = toolTipsifyMixin(_chart, 'g.pie-slice');
    _chart.toolTipsify();

    return _chart;
  };

  original.barChart = dc.barChart;
  dc.barChart = function(parent, opts) {
    var _chart = original.barChart(parent);
    _chart = toolTipsifyMixin(_chart, 'rect.bar');
    _chart.toolTipsify();

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