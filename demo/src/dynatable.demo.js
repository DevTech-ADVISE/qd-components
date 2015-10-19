var dc = require('../../index.js');
var fixtures = require('../../spec/helpers/fixtures.js');

var id, dynatable, data;
var assistanceCategoryId, assistanceCategoryDimension, assistanceCategoryGroup, assistanceCategoryChart;
var regionId, regionDimension, regionGroup, regionChart;
var listingDimension, listingGroup;

window.clickCell = function(record) {
	alert("You clicked data for the country " + record.country_name);
};

var customCellFunc = function(cellValue, column, record) {

	//stringify the javascript object so it can be used in the link's onclick
	//note that the onclick uses single quotes so that the object that is stringified can use its standard double quotes
	var stringified = JSON.stringify(record);
	stringified = stringified.replace("'", "\\'");

	if(column.label === "Region"){
		var html = "<a class='custom-cell-content' onclick='clickCell(" + stringified + ")'>" + cellValue + "</a>";
		return html;
	}
	else
		return "<span>" + cellValue + "</span>";
};

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
			  .group(listingGroup)
			  .cellContent(customCellFunc);
dynatable.columns([{label: "Region", csvColumnName: "region_name"},
				   {label: "Assitance Category", csvColumnName: "assistance_category_name"},
				   {label: "Sector", csvColumnName: "dac_sector_name"},
				   {label: "Country", csvColumnName: "country_name"}]);


dc.renderAll();