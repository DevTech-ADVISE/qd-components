var dc = require('dc'),
    jQuery = require('jquery');
var $ = jQuery;

var dcCustom = {
  filterTrail: require('./filter-trail'),
  filterBuilder: require('./filter-builder'),
  selectControl: require('./select-control'),
  dynatableComponent: require('./dynatable-component'),
  audioDash: require('./audio-dash')
}

jQuery.extend(dc, dcCustom);

module.exports = dc;
