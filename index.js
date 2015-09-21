var dc = require('dc'),
    jQuery = require('jquery');
var $ = jQuery;

var jsPath = './src/javascripts/';
var quickDefaults = require(jsPath + 'quick-defaults');
var toolTipsify = require(jsPath + 'tool-tipsify');
var sizeBoxify = require(jsPath + 'size-boxify');

// custom charts & components
var dcCustom = {
  filterBuilder: require(jsPath + 'filter-builder'),
  dynatableComponent: require(jsPath + 'dynatable-component'),
  audioDash: require(jsPath + 'audio-dash')
};

jQuery.extend(dc, dcCustom);

// modify DC to have nice defaults, be tipsified and sizeboxified
var dcWithDefaults = quickDefaults(dc);
var dcWithTips = toolTipsify(dcWithDefaults);
dc = sizeBoxify(dcWithTips);

module.exports = dc;
