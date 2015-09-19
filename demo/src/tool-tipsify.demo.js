dc = require('../../index.js');
var fixtures = require('../../spec/helpers/fixtures.js');
var dataFilePath = './data/bubble_map_table.csv';
var countriesGeoJsonFilePath = './data/countries.geo.json';

require('dc/dc.css');
require('./stylesheets/tool-tipsify.demo.scss');

var data;
var assistanceCategoryId, assistanceCategoryDimension, assistanceCategoryGroup, assistanceCategoryChart;
var regionId, regionDimension, regionGroup, regionChart;
var yearId, yearDimension, yearGroup, yearChart;
var countryId, countryDimension, countryGroup, countryChart;
var toolTipFunc = function(d) {return d.data.key + ": " + d.data.value;};
var yearToolTipFunc = function(d) {return "Year: " + d.data.key + "<br/>Value: " + d.data.value}

//geochoropleth attributes
var _colorRange = ["#a9c8f4", "#7fa1d2", "#5479b0", "#2a518e", "#002A6C"];
var _zeroColor = '#ccc';
var _layerName = 'country';
var _colorDomain = [100, 60000];
var geoJsonKeyField = 'id';

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

  yearDimension = data.dimension(function(d) { return Number(d.fiscal_year); });
  yearGroup = yearDimension.group();//.reduceSum(function(d) { return d.value;});

  countryDimension = data.dimension(function(d) { return d.country_code;});
  countryGroup = countryDimension.group();

  regionChart = dc.pieChart('#' + regionId);
  regionChart.dimension(regionDimension).group(regionGroup)
    .width(600).height(200)
    .radius(100)
    .innerRadius(40)
    .title(function(d) {return d.region})
    .transitionDuration(0);

  assistanceCategoryChart = dc.rowChart('#' + assistanceCategoryId);
  assistanceCategoryChart.dimension(assistanceCategoryDimension).group(assistanceCategoryGroup)
    .width(600).height(200).gap(10)
    .transitionDuration(0);

  yearChart = dc.barChart('#' + yearId)
    .dimension(yearDimension).group(yearGroup)
    .width(600).height(200).gap(10)
    .elasticY(true)
    .x(d3.scale.ordinal().domain([2007, 2008, 2009, 2010, 2011, 2012, 2013, 2014]))
    .xUnits(dc.units.ordinal);

    d3.json(countriesGeoJsonFilePath, function(geoJson) {

      countryChart = dc.geoChoroplethChart('#' + countryId)
        .width(700)
        .height(300)
        .dimension(countryDimension)
        .group(countryGroup)
        .colors(d3.scale.quantize().range(_colorRange))
        .colorDomain(_colorDomain)
        .colorCalculator(function (d) {
          if(d === undefined) return _zeroColor;
          if(d < 1 )return _zeroColor;
          return countryChart.colors()(Math.sqrt(d)); 
        })
        .projection(d3.geo.mercator())
        .overlayGeoJson(geoJson.features, _layerName, function(d) {
          return d[geoJsonKeyField];
        });



      //*********tipsify your charts**************
      // regionChart has the automatic toolTipsify behavior
      assistanceCategoryChart.toolTipsify({position: 'e', offset: [0, 5]});
      yearChart.toolTipsify({position: 'n', content: yearToolTipFunc, offset: [-5, 0]});

      dc.renderAll();

    });







  

  }
);
  