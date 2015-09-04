var dc = require('../../index.js');
var fixtures = require('../../spec/helpers/fixtures.js');

require('dc/dc.css');
//include styles
//better data set for paging
//don't require the group, its not using it

var id, dynatable, data;
var stateId, stateDimension, stateGroup, stateChart;
var regionId, regionDimension, regionGroup, regionChart;
var listingDimension, listingGroup;

data = crossfilter(fixtures.loadDateFixture());

id = 'dynatable';

stateId = 'state-chart';

regionId = 'region-chart';

listingDimension = data.dimension(function(d) {return d.id;});
listingGroup = listingDimension.group(); 

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

dynatable = dc.dynatableComponent('#' + id)
			  .dimension(listingDimension)
			  .group(listingGroup);
dynatable.columns([{label: "Region", csvColumnName: "region"},
				   {label: "State", csvColumnName: "state"}]);

dc.renderAll();