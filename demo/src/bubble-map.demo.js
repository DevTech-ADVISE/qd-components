dc = require('../../index.js');
var fixtures = require('../../spec/helpers/fixtures.js');
var dataFilePath = './data/bubble_map_table.csv';
var countriesGeoJsonFilePath = './data/countries.geo.json';
var formatters = require('qd-formatters')(d3);

require('./stylesheets/bubble-map.demo.scss');

//add kpi chart
var data;
var filterBuilderId, filterBuilder;
var totalFundingId, totalFundingSum, totalFundingChart;
var assistanceCategoryId, assistanceCategoryDimension, assistanceCategoryGroup, assistanceCategoryChart;
var regionId, regionDimension, regionGroup, regionChart;
// var yearId, yearDimension, yearGroup, yearChart, yearList;
var countryId, countryDimension, countryGroup, countryChart;

//year player 
var yearPlayerState;

d3.csv(dataFilePath, function(d) {

  //add more charts, and show the tool tip positions, add any more documentation
  data = crossfilter(d);

  filterBuilderId = 'filter-builder';
  totalFundingId = 'total-funding-chart';
  assistanceCategoryId = 'assistance-category-chart';
  regionId = 'region-chart';
  yearPlayerId = 'year-player-control';
  timelineId = 'year-chart';
  yearDisplayId = 'year-display';
  countryId = 'country-chart';

  totalFundingSum = data.groupAll().reduceSum(function(d) { return d.constant_amount;});

  assistanceCategoryDimension = data.dimension(function(d) { return d.assistance_category_name; });
  assistanceCategoryGroup = assistanceCategoryDimension.group();

  regionDimension = data.dimension(function(d) { return d.region_name; });
  regionGroup = regionDimension.group();

  yearDimension = data.dimension(function(d) { return Number(d.fiscal_year); });
  yearGroup = yearDimension.group().reduceSum(function(d) { return d.constant_amount;});

  countryDimension = data.dimension(function(d) { return d.country_code;});
  countryGroup = countryDimension.group().reduceSum(function(d) { return d.constant_amount;});

  totalFundingChart = dc.kpiGauge('#' + totalFundingId, countryDimension, totalFundingSum, {title: "Total Obligations", formatter: formatters.bigCurrencyFormat});

  regionChart = dc.pieChart('#' + regionId).options({centerTitle: 'Regions'});
  regionChart.dimension(regionDimension).group(regionGroup)
    .title(function(d) {return d.region})
    .transitionDuration(0);

  assistanceCategoryChart = dc.pieChart('#' + assistanceCategoryId).options({centerTitle: 'Assistance Category'});
  assistanceCategoryChart.dimension(assistanceCategoryDimension).group(assistanceCategoryGroup)
    .title(function(d) {return d.assistance_category_name})
    .transitionDuration(0);

  yearChart = dc.timelineComponent('#' + yearPlayerId, '#' + timelineId, '#' + yearDisplayId, yearDimension, yearGroup, 'Fiscal Year', 'Constant Dollars'); 

  filterBuilder = dc.filterBuilder('#' + filterBuilderId);


  //NOTE: the json will take about 500 milliseconds to load
  d3.json(countriesGeoJsonFilePath, function(geoJson) {
        var geoJsonKeyField = 'id';
        var _layerName = 'country';

        countryChart = dc.geoBubbleOverlayChart('#' + countryId)// {formatter: formatters.currencyFormat})
          .dimension(countryDimension)
          .group(countryGroup)
          .setGeoJson(geoJson.features, _layerName, function(d) {
            return d[geoJsonKeyField];
          });
        countryChart
          .labelLookupKey('country_name')
          .lookupTable('country_code', ['country_name'], countryDimension.top(Infinity));

        filterBuilder.filterSources([{chart: regionChart, label: "Region"},
                               {chart: assistanceCategoryChart, label: "Assistance Category"},
                               {chart: countryChart, label: "Country"}]);
        
        dc.renderAll();

        yearChart.timeline.redraw();
  });


});


