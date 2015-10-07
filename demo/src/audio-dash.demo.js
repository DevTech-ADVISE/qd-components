var dc = require('../../index.js');
var fixtures = require('../../spec/helpers/fixtures.js');


var id, audioDash, data;
var stateId, stateDimension, stateGroup, stateChart;
var regionId, regionDimension, regionGroup, regionChart;

data = crossfilter(fixtures.loadDateFixture());

id = 'audio-dash';

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

var audioCurrency = function(key, value) {return key + " " + qd.numberFormat(value) + " dollars";};
var formatter = function(key, value) {return key + ": " + value};

var audioDash = dc.audioDash("#audio-dash")
  .charts({"Region": {chart: regionChart, formatter: formatter},
           "State": {chart: stateChart, formatter: formatter}
          });

dc.renderAll();