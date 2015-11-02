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
var yearId, yearDimension, yearGroup, yearChart, yearList;
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
  yearId = 'year-chart';
  countryId = 'country-chart';

  totalFundingSum = data.groupAll().reduceSum(function(d) { return d.constant_amount;});

  assistanceCategoryDimension = data.dimension(function(d) { return d.assistance_category_name; });
  assistanceCategoryGroup = assistanceCategoryDimension.group();

  regionDimension = data.dimension(function(d) { return d.region_name; });
  regionGroup = regionDimension.group();

  yearDimension = data.dimension(function(d) { return d.fiscal_year; });
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

  yearList = yearGroup.top(Infinity).map(function(d){return d.key;}).sort();
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


        var intervalTime = 850;
        // if(navigator.appVersion.indexOf("MSIE 10.")!=-1) intervalTime = 1250;
        // if(navigator.appVersion.indexOf("MSIE 9.")!=-1) intervalTime = 1500;
        // if(mobilecheck == true) intervalTime = 2000;

        window.setInterval(function() {if(yearPlayerState==='playing') advanceYearSelection();}, intervalTime);


        dc.renderAll();
  });


});


advanceYearSelection = function() {
        var currentYearPosition = yearList.indexOf(yearChart.filters()[0]);
        var nextYearPosition;
        if (currentYearPosition >= yearList.length-1){
          nextYearPosition = 0;
        }else{
          nextYearPosition = currentYearPosition + 1
        }
        var nextYear = yearList[nextYearPosition];
        dc.events.trigger(function(){
          yearChart.filterAll();
          yearChart.filter(nextYear);
          yearChart.redrawGroup();
        });
    }

previousYearSelection = function() {
    var currentYearPosition = yearList.indexOf(yearChart.filters()[0]);
    var nextYearPosition;
    if (currentYearPosition <= 0){
      nextYearPosition = yearList.length-1;
    } else{
      nextYearPosition = currentYearPosition - 1
    }
    var nextYear = yearList[nextYearPosition];
    dc.events.trigger(function(){
      yearChart.filterAll();
      yearChart.filter(nextYear);
      yearChart.redrawGroup();
    });
}

pauseYearPlayer = function() {
    yearPlayerState = 'paused';
    d3.select('#player-controls .pause').classed('active', true);
    d3.select('#player-controls .play').classed('active', false);

}
playYearPlayer = function() {
    yearPlayerState = 'playing';
    d3.select('#player-controls .pause').classed('active', false);
    d3.select('#player-controls .play').classed('active', true);
}

yearPlayerState = 'paused'; // one of: ['paused', 'playing']

var resizeTimer;
d3.select(window).on('resize', function() {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(resize, 166);
});
d3.select('#player-controls .pause').on('click', pauseYearPlayer);
d3.select('#player-controls .play').on('click', playYearPlayer);
d3.select('#player-controls .next').on('click', advanceYearSelection);
d3.select('#player-controls .prev').on('click', previousYearSelection);

