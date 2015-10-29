dc = require('../../index.js');
var fixtures = require('../../spec/helpers/fixtures.js');
var dataFilePath = './data/bubble_map_table.csv';
var countriesGeoJsonFilePath = './data/countries.geo.json';
var formatters = require('qd-formatters')(d3);

require('./stylesheets/bubble-map.demo.scss');

//add kpi chart
var data;
var filterBuilderId, filterBuilder;
var assistanceCategoryId, assistanceCategoryDimension, assistanceCategoryGroup, assistanceCategoryChart;
var regionId, regionDimension, regionGroup, regionChart;
var yearId, yearDimension, yearGroup, yearChart;
// var countryId, countryDimension, countryGroup, countryChart;

d3.csv(dataFilePath, function(d) {

  //add more charts, and show the tool tip positions, add any more documentation
  data = crossfilter(d);

  filterBuilderId = 'filter-builder';
  assistanceCategoryId = 'assistance-category-chart';
  regionId = 'region-chart';
  yearId = 'year-chart';
  countryId = 'country-chart';

  assistanceCategoryDimension = data.dimension(function(d) { return d.assistance_category_name; });
  assistanceCategoryGroup = assistanceCategoryDimension.group();

  regionDimension = data.dimension(function(d) { return d.region_name; });
  regionGroup = regionDimension.group();

  yearDimension = data.dimension(function(d) { return d.fiscal_year; });
  yearGroup = yearDimension.group().reduceSum(function(d) { return d.constant_amount;});

  countryDimension = data.dimension(function(d) { return d.country_code;});
  countryGroup = countryDimension.group().reduceSum(function(d) { return d.constant_amount;});

  regionChart = dc.pieChart('#' + regionId).options({centerTitle: 'Regions'});
  regionChart.dimension(regionDimension).group(regionGroup)
    .title(function(d) {return d.region})
    .transitionDuration(0);

  assistanceCategoryChart = dc.pieChart('#' + assistanceCategoryId).options({centerTitle: 'Assistance Category'});
  assistanceCategoryChart.dimension(assistanceCategoryDimension).group(assistanceCategoryGroup)
    .title(function(d) {return d.assistance_category_name})
    .transitionDuration(0);

  var yearList = yearGroup.top(Infinity).map(function(d){return d.key;}).sort();
  yearChart = dc.barChart('#' + yearId)
    .dimension(yearDimension).group(yearGroup)
    .gap(10)
    .elasticY(true)
    .x(d3.scale.ordinal().domain(yearList))
    .xUnits(dc.units.ordinal)
    .transitionDuration(0);

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
  });


});
