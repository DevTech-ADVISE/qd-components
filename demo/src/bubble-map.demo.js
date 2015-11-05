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
var fundingAgencyId, fundingAgencyDimension, fundingAgencyGroup, fundingAgencyChart;
var timelineId, yearPlayerControlId, yearDimension, yearGroup, yearChart, yearList;
var countryId, countryDimension, countryGroup, countryChart;

//year player 
var yearPlayerState;

d3.csv(dataFilePath, function(d) {

  //add more charts, and show the tool tip positions, add any more documentation
  data = crossfilter(d);

  filterBuilderId = 'filter-builder';
  totalFundingId = 'total-funding-chart';
  assistanceCategoryId = 'assistance-category-chart';
  fundingAgencyId = 'funding-agency-chart';
  yearPlayerControlId = 'year-player-control';
  timelineId = 'year-chart';
  countryId = 'country-chart';

  totalFundingSum = data.groupAll().reduceSum(function(d) { return d.constant_amount;});

  assistanceCategoryDimension = data.dimension(function(d) { return d.assistance_category_name; });
  assistanceCategoryGroup = assistanceCategoryDimension.group();

  fundingAgencyDimension = data.dimension(function(d) { return d.funding_agency_name; });
  fundingAgencyGroup = fundingAgencyDimension.group();

  yearDimension = data.dimension(function(d) { return Number(d.fiscal_year); });
  yearGroup = yearDimension.group().reduceSum(function(d) { return d.constant_amount;});

  countryDimension = data.dimension(function(d) { return d.country_code;});
  countryGroup = countryDimension.group().reduceSum(function(d) { return d.constant_amount;});

  totalFundingChart = dc.kpiGauge('#' + totalFundingId, countryDimension, totalFundingSum, {title: "Total Obligations", formatter: formatters.bigCurrencyFormat});

  fundingAgencyChart = dc.pieChart('#' + fundingAgencyId).options({centerTitle: ['Funding', 'Agency']});
  fundingAgencyChart.dimension(fundingAgencyDimension).group(fundingAgencyGroup)
    .title(function(d) {return d.funding_agency_name})
    .slicesCap(6)
    .transitionDuration(0);

  assistanceCategoryChart = dc.pieChart('#' + assistanceCategoryId, {centerLegend: true}).options({centerTitle: ['Assistance', 'Category']});
  assistanceCategoryChart.dimension(assistanceCategoryDimension).group(assistanceCategoryGroup)
    .title(function(d) {return d.assistance_category_name})
    .transitionDuration(0);

  yearChart = dc.timelineComponent('#' + yearPlayerControlId, '#' + timelineId, yearDimension, yearGroup, 'Fiscal Year', 'Constant Dollars'); 

  filterBuilder = dc.filterBuilder('#' + filterBuilderId);


  //NOTE: the json will take about 500 milliseconds to load
  d3.json(countriesGeoJsonFilePath, function(geoJson) {
        var geoJsonKeyField = 'id';
        var _layerName = 'country';

        countryChart = dc.geoBubbleOverlayChart('#' + countryId)// {formatter: formatters.currencyFormat})
          .dimension(countryDimension)
          .group(countryGroup)
          .radiusValueModifier(1000000)
          .setGeoJson(geoJson.features, _layerName, function(d) {
            return d[geoJsonKeyField];
          });
        countryChart
          .labelLookupKey('country_name')
          .lookupTable('country_code', ['country_name'], countryDimension.top(Infinity));

        filterBuilder.filterSources([{chart: fundingAgencyChart, label: "FundingAgency"},
                               {chart: assistanceCategoryChart, label: "Assistance Category"},
                               {chart: countryChart, label: "Country"}]);
        
        dc.renderAll();

        yearChart.timeline.redraw();
  });


});


