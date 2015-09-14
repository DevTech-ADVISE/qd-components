dc = require('../../index.js');
var fixtures = require('../../spec/helpers/fixtures.js');

require('dc/dc.css');

var data;
var stateId, stateDimension, stateGroup, stateChart;
var regionId, regionDimension, regionGroup, regionChart;
var countryId, countryDimension, countryGroup, countryChart;

//add more charts, and show the tool tip positions, add any more documentation
data = crossfilter(fixtures.loadDateFixture());

stateId = 'state-chart';
regionId = 'region-chart';
countryId = 'country-chart';

stateDimension = data.dimension(function(d) { return d.state; });
stateGroup = stateDimension.group();

regionDimension = data.dimension(function(d) { return d.region; });
regionGroup = regionDimension.group();

countryDimension = data.dimension(function(d) { return d.countrycode; });
countryGroup = countryDimension.group();

stateChart = dc.rowChart('#' + stateId);
stateChart.dimension(stateDimension).group(stateGroup)
  .width(600).height(200).gap(10)
  .transitionDuration(0);

regionChart = dc.rowChart('#' + regionId);
regionChart.dimension(regionDimension).group(regionGroup)
  .width(600).height(200).gap(10)
  .transitionDuration(0);

dc.toolTipsify(stateChart);
dc.toolTipsify(regionChart, {position: 'n'});

dc.renderAll();