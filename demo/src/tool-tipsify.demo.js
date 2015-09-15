dc = require('../../index.js');
var fixtures = require('../../spec/helpers/fixtures.js');

require('dc/dc.css');
require('./stylesheets/tool-tipsify.demo.scss');

var data;
var stateId, stateDimension, stateGroup, stateChart;
var regionId, regionDimension, regionGroup, regionChart;
var yearId, yearDimension, yearGroup, yearChart;
var toolTipFunc = function(d) {return d.data.key + ": " + d.data.value;};
var yearToolTipFunc = function(d) {return "Year: " + d.data.key + "<br/>Value: " + d.data.value}

//add more charts, and show the tool tip positions, add any more documentation
data = crossfilter(fixtures.loadDateFixture());

stateId = 'state-chart';
regionId = 'region-chart';
yearId = 'year-chart';

stateDimension = data.dimension(function(d) { return d.state; });
stateGroup = stateDimension.group();

regionDimension = data.dimension(function(d) { return d.region; });
regionGroup = regionDimension.group();

yearDimension = data.dimension(function(d) { return d.year; });
yearGroup = yearDimension.group().reduceSum(function(d) { return d.value;});

stateChart = dc.rowChart('#' + stateId);
stateChart.dimension(stateDimension).group(stateGroup)
  .width(600).height(200).gap(10)
  .transitionDuration(0);

regionChart = dc.pieChart('#' + regionId);
regionChart.dimension(regionDimension).group(regionGroup)
  .width(600).height(200)
  .radius(100)
  .innerRadius(40)
  .title(function(d) {return d.region})
  .transitionDuration(0);

yearChart = dc.barChart('#' + yearId)
  .dimension(yearDimension).group(yearGroup)
  .width(600).height(200).gap(10)
  .elasticY(true)
  .x(d3.scale.ordinal().domain([2007, 2008, 2009, 2010, 2011]))
  .xUnits(dc.units.ordinal);

//*********tipsify your charts**************
dc.toolTipsify(regionChart, {content: toolTipFunc});
dc.toolTipsify(stateChart, {position: 'e', offset: [0, 5]});
dc.toolTipsify(yearChart, {position: 'n', content: yearToolTipFunc, offset: [-5, 0]})


dc.renderAll();