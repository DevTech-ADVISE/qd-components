var dc = require('../../index.js');
var fixtures = require('../../spec/helpers/fixtures.js');

require('dc/dc.css');
//include styles
//better data set for paging
//don't require the group, its not using it

var id, dynatable, data;
var assistanceCategoryId, assistanceCategoryDimension, assistanceCategoryGroup, assistanceCategoryChart;
var regionId, regionDimension, regionGroup, regionChart;
var listingDimension, listingGroup;

data = crossfilter(fixtures.loadForeignAidFixture());

id = 'dynatable';

assistanceCategoryId = 'assistance-category-chart';

regionId = 'region-chart';

listingDimension = data.dimension(function(d) {return d.activity_name;});
listingGroup = listingDimension.group(); 

assistanceCategoryDimension = data.dimension(function(d) { return d.assistance_category_name; });
assistanceCategoryGroup = assistanceCategoryDimension.group();

regionDimension = data.dimension(function(d) { return d.region_name; });
regionGroup = regionDimension.group();

assistanceCategoryChart = dc.rowChart('#' + assistanceCategoryId);
assistanceCategoryChart.dimension(assistanceCategoryDimension).group(assistanceCategoryGroup)
  .width(600).height(200).gap(10)
  .transitionDuration(0);

regionChart = dc.rowChart('#' + regionId);
regionChart.dimension(regionDimension).group(regionGroup)
  .width(600).height(200).gap(10)
  .transitionDuration(0);

dynatable = dc.dynatableComponent('#' + id)
			  .dimension(listingDimension)
			  .group(listingGroup);
dynatable.columns([{label: "Region", csvColumnName: "region_name"},
				   {label: "Assitance Category", csvColumnName: "assistance_category_name"},
				   {label: "Sector", csvColumnName: "dac_sector_name"},
				   {label: "Country", csvColumnName: "country_name"}]);


dc.renderAll();