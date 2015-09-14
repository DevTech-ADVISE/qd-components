var dc = require('dc'),
    jQuery = require('jquery');
var $ = jQuery;

var jsPath = './src/javascripts/';

var dcCustom = {
  filterBuilder: require(jsPath + 'filter-builder'),
  dynatableComponent: require(jsPath + 'dynatable-component'),
  audioDash: require(jsPath + 'audio-dash'),
  toolTipsify: require(jsPath + 'tool-tipsify')
};

jQuery.extend(dc, dcCustom);

module.exports = dc;
