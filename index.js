var dc = require('dc'),
    jQuery = require('jquery');
var $ = jQuery;

var jsPath = './src/javascripts/';
var cssPath = './src/stylesheets/';
var quickDefaults = require(jsPath + 'quick-defaults');
var toolTipsify = require(jsPath + 'tool-tipsify');
var sizeBoxify = require(jsPath + 'size-boxify');
require(cssPath + 'common.scss');
require('font-awesome/css/font-awesome.css');
require('normalize.css/normalize.css');
require('dc/dc.css');

// custom charts & components
var dcCustom = {
  filterBuilder: require(jsPath + 'filter-builder'),
  dynatableComponent: require(jsPath + 'dynatable-component'),
  audioDash: require(jsPath + 'audio-dash'),
  kpiGauge: require(jsPath + 'kpi-gauge'),
  timelineComponent: require(jsPath + 'timeline-component')
};

jQuery.extend(dc, dcCustom);

// modify DC to have nice defaults. 
// Sizeboxify is the entry point which then inherits/calls functions from tool-tipsify and quick-defaults
var dcQd = sizeBoxify();

module.exports = dcQd;
