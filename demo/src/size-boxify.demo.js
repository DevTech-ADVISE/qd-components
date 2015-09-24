dc = require('../../index.js');
var fixtures = require('../../spec/helpers/fixtures.js');
var dataFilePath = './data/bubble_map_table.csv';
var countriesGeoJsonFilePath = './data/countries.geo.json';

require('dc/dc.css');
require('./stylesheets/size-boxify.demo.scss');


//add pie chart with legend
//add kpi chart
var data;
var assistanceCategoryId, assistanceCategoryDimension, assistanceCategoryGroup, assistanceCategoryChart;
var regionId, regionDimension, regionGroup, regionChart;
var yearId, yearDimension, yearGroup;//yearChart;
var countryId, countryDimension, countryGroup, countryChart;

d3.csv(dataFilePath, function(d) {

  //add more charts, and show the tool tip positions, add any more documentation
  data = crossfilter(d);

  assistanceCategoryId = 'assistance-category-chart';
  regionId = 'region-chart';
  yearId = 'year-chart';
  countryId = 'country-chart';

  assistanceCategoryDimension = data.dimension(function(d) { return d.assistance_category_name; });
  assistanceCategoryGroup = assistanceCategoryDimension.group();

  regionDimension = data.dimension(function(d) { return d.region_name; });
  regionGroup = regionDimension.group();

  yearDimension = data.dimension(function(d) { return d.fiscal_year; });
  yearGroup = yearDimension.group();//.reduceSum(function(d) { return d.value;});

  countryDimension = data.dimension(function(d) { return d.country_code;});
  countryGroup = countryDimension.group();

  regionChart = dc.pieChart('#' + regionId);
  regionChart.dimension(regionDimension).group(regionGroup)
    .title(function(d) {return d.region})
    .transitionDuration(0);

  assistanceCategoryChart = dc.rowChart('#' + assistanceCategoryId);
  assistanceCategoryChart.dimension(assistanceCategoryDimension).group(assistanceCategoryGroup)
    .gap(10)
    .transitionDuration(0);

  yearChart = dc.barChart('#' + yearId)
    .dimension(yearDimension).group(yearGroup)
    .gap(10)
    .elasticY(true)
    .x(d3.scale.ordinal().domain([2007, 2008, 2009, 2010, 2011, 2012, 2013, 2014]))
    .xUnits(dc.units.ordinal)
    .transitionDuration(0);

  d3.json(countriesGeoJsonFilePath, function(geoJson) {
        var geoJsonKeyField = 'id';
        var _layerName = 'country';

        countryChart = dc.geoChoroplethChart('#' + countryId)
          .dimension(countryDimension)
          .group(countryGroup)
          .overlayGeoJson(geoJson.features, _layerName, function(d) {
            return d[geoJsonKeyField];
          });

        dc.renderAll();
  });

  //*********sizeboxify your charts here**************


  

});
