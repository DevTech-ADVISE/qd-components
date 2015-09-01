var fixtures = require('./helpers/fixtures.js');
var dc = require('../index.js');

// If we're using browserify bundle, pull d3 and crossfilter out of it,
// so that tests don't have to deal with this incidental complexity.
if (typeof d3 === 'undefined') { d3 = dc.d3; }
if (typeof crossfilter === 'undefined') { crossfilter = dc.crossfilter; }

function appendChartID(id) {
    return d3.select("#test-content").append("div").attr("id", id);
}

describe("filterBuilder", function(){

  var id, filterBuilder, data;
  var stateId, stateDimension, stateGroup, stateChart;
  var regionId, regionDimension, regionGroup, regionChart;

  beforeEach(function(){

    d3.select("body").append("div").attr("id", "test-content");
    jasmine.clock().install();

    data = crossfilter(fixtures.loadDateFixture());

    id = 'filter-builder';
    appendChartID(id);

    stateId = 'state-chart';
    appendChartID(stateId);
    regionId = 'regionChart';
    appendChartID(regionId);

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
  });

  afterEach(function () {
    dc.deregisterAllCharts();
    dc.renderlet(null);
    d3.selectAll("#test-content").remove();
    jasmine.clock().uninstall();
  });

  it("should hide dimension & value menus in initial state", function(){
    var dimensionMenu = d3.select('.dimension-list-container');
    var valueMenu = d3.select('.value-list-container');
    expect(dimensionMenu.style('display')).toBe('none');
    expect(valueMenu.style('display')).toBe('none');
  });

  it("should show dimension menu when AddFilter button is clicked", function(){
    var addFilterButton = d3.select('.add-filter');
    addFilterButton.on('click')();
    var dimensionMenu = d3.select('.dimension-list-container');
    expect(dimensionMenu.style('display')).toBe('block');
  });

  it("should show value menu when a dimension is clicked", function(){
    // It seems Karma is clobbering 'this' context for d3 selection.on functions... no fix in sight.
    //
    // var addFilterButton = d3.select('.add-filter');
    // addFilterButton.on('click')();
    // var dimensionMenu = d3.select('.dimension-list-container');
    // var dimensionOption = dimensionMenu.select('.dimension-option');
    // dimensionOption.on('click')();
    // var valueMenu = d3.select('.value-list-container');
    // expect(valueMenu.style('display')).toBe('block');
    // 
    // 
    expect(true).toBe(false);
  });

  it("should add a filter when a value is clicked", function(){
    expect(true).toBe(false);
  });

});