dc = require('../../index.js');
var fixtures = require('../../spec/helpers/fixtures.js');
var dataFilePath = './data/bubble_map_table.csv';
var countriesGeoJsonFilePath = './data/countries.geo.json';
var formatters = require('qd-formatters')(d3);

require('./stylesheets/size-boxify.demo.scss');

//add kpi chart
var data;
var assistanceCategoryId, assistanceCategoryDimension, assistanceCategoryGroup, assistanceCategoryChart;
var regionId, regionDimension, regionGroup, regionChart;
// var yearId, yearDimension, yearGroup, yearChart;
var countryId, countryDimension, countryGroup, countryChart;
var fundingId, fundingDimension, fundingGroupSum, fundingChart;

d3.csv(dataFilePath, function(d) {

  //add more charts, and show the tool tip positions, add any more documentation
  data = crossfilter(d);

  assistanceCategoryId = 'assistance-category-chart';
  regionId = 'region-chart';
  yearId = 'year-chart';
  countryId = 'country-chart';
  fundingId = 'funding-chart';

  assistanceCategoryDimension = data.dimension(function(d) { return d.assistance_category_name; });
  assistanceCategoryGroup = assistanceCategoryDimension.group();

  regionDimension = data.dimension(function(d) { return d.region_name; });
  regionGroup = regionDimension.group();

  yearDimension = data.dimension(function(d) { return d.fiscal_year; });
  yearGroup = yearDimension.group().reduceSum(function(d) { return d.constant_amount;});

  countryDimension = data.dimension(function(d) { return d.country_code;});
  countryGroup = countryDimension.group().reduceSum(function(d) { return d.constant_amount;});

  fundingGroupSum = data.groupAll().reduceSum(function(d) { return d.constant_amount;});

  regionChart = dc.pieChart('#' + regionId).centerTitle('Regions');
  regionChart.dimension(regionDimension).group(regionGroup)
    .title(function(d) {return d.region})
    .transitionDuration(0);

  assistanceCategoryChart = dc.rowChart('#' + assistanceCategoryId);
  assistanceCategoryChart.dimension(assistanceCategoryDimension).group(assistanceCategoryGroup)
    .gap(10)
    .transitionDuration(0);

  var yearList = yearGroup.top(Infinity).map(function(d){return d.key;}).sort();
  yearChart = dc.barChart('#' + yearId)
    .dimension(yearDimension).group(yearGroup)
    .gap(10)
    .elasticY(true)
    .x(d3.scale.ordinal().domain(yearList))
    .xUnits(dc.units.ordinal)
    .transitionDuration(0);

  fundingChart = dc.kpiGauge('#' + fundingId, countryDimension, fundingGroupSum, {title: "Total Funding", formatter: formatters.bigCurrencyFormat});

  d3.json(countriesGeoJsonFilePath, function(geoJson) {
        var geoJsonKeyField = 'id';
        var _layerName = 'country';

        countryChart = dc.geoChoroplethChart('#' + countryId, {formatter: formatters.currencyFormat})
          .dimension(countryDimension)
          .group(countryGroup)
          .overlayGeoJson(geoJson.features, _layerName, function(d) {
            return d[geoJsonKeyField];
          });

        dc.renderAll();
  });

  //*********sizeboxify your charts here**************


});
