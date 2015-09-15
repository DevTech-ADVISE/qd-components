var dc = require('dc'),
    inflection = require('inflection'),
    dtip = require('d3-tip')(d3);

require('../stylesheets/tool-tipsify.scss');

var toolTipsify = function(chart, options){

  // default & override setup for formatter
  var formatter = d3.format(",");
  if (options && options.formatter) {
    formatter = options.formatter;
  }

  // default setup for content & position 
  var content = function(d) {
    return "<label>" + chart.label()(d) + "</label><br/>" + formatter(d.value);
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

    var tippables = tippableSelector(chart); 

    // HACK...
    if (!d3.select('#' + ttId).empty()) d3.select('#' + ttId).remove(); 

    tippables.call(tt);
    tippables.on('mouseover', tt.show)
             .on('mouseout', tt.hide)
             .on('click', tt.hide);
    if(position === 'mouse') {
      tippables.on('mousemove', tt.updatePosition)
    }
  });

};

function tippableSelector(chart) {

  var selectors = ['g.row', 'g.pie-slice', 'g.country', 'g.bubble', 'rect.bar'];

  for(var i=0; i<selectors.length;i++) {
    var tippables = chart.selectAll(selectors[i]);
    if (tippables[0].length > 0) {
      return tippables;
    }
  }

}

module.exports = toolTipsify;