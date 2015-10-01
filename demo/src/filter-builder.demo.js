var dc = require('../../index.js');
var fixtures = require('../../spec/helpers/fixtures.js');

var id, filterBuilder, data;
var stateId, stateDimension, stateGroup, stateChart;
var regionId, regionDimension, regionGroup, regionChart;

data = crossfilter(fixtures.loadDateFixture());

id = 'filter-builder';

stateId = 'state-chart';

regionId = 'region-chart';


stateDimension = data.dimension(function(d) { return d.state; });
stateGroup = stateDimension.group();

regionDimension = data.dimension(function(d) { return d.region; });
regionGroup = regionDimension.group();

stateChart = dc.rowChart('#' + stateId);
stateChart.dimension(stateDimension).group(stateGroup)
  .width(600).height(200).gap(10)
  .transitionDuration(0);

regionChart = dc.rowChart('#' + regionId);
regionChart.dimension(regionDimension).group(regionGroup)
  .width(600).height(200).gap(10)
  .transitionDuration(0);

filterBuilder = dc.filterBuilder('#' + id);
filterBuilder.filterSources([{chart: regionChart, label: "Region"},{chart: stateChart, label: "State"}]);

dc.renderAll();