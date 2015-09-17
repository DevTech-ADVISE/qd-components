var dc = require('dc'),
    jQuery = require('jquery');
var $ = jQuery;

var jsPath = './src/javascripts/';
var toolTipsify = require(jsPath + 'tool-tipsify');

// custom charts & components
var dcCustom = {
  filterBuilder: require(jsPath + 'filter-builder'),
  dynatableComponent: require(jsPath + 'dynatable-component'),
  audioDash: require(jsPath + 'audio-dash')
};

jQuery.extend(dc, dcCustom);

// chart & component mods
dc = toolTipsify(dc);

module.exports = dc;
