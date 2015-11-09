# qd-components

This library slaps a few handy extra features on to the excellent [DC.js](http://dc-js.github.io/dc.js/) dashboard framework.

Use it wherever you would use DC.js.

## Getting Started

Install

```
npm install qd-components
```

Require in your code

```
var dc = require('qd-components');
```

IMPORTANT LOADERS
You must use webpack in your parent application, and include the following loaders in your webpack.config.js file. Also remember you must npm install each of these loaders before you can use them. 
```
module: {
    loaders: [
      {
        test: /\.scss$/,
        loader: 'style!css!sass'
      },
      { 
        test: /\.css$/, 
        loader: "style-loader!css-loader" 
      },
      {
        test: /\.woff(\?v=\d+\.\d+\.\d+)?$/,
        loader: "url?limit=10000&mimetype=application/font-woff"
      },
      {
        test: /\.woff2(\?v=\d+\.\d+\.\d+)?$/,
        loader: "url?limit=10000&mimetype=application/font-woff"
      }, 
      {
        test: /\.ttf(\?v=\d+\.\d+\.\d+)?$/,
        loader: "url?limit=10000&mimetype=application/octet-stream"
      }, 
      {
        test: /\.eot(\?v=\d+\.\d+\.\d+)?$/,
        loader: "file"
      }, 
      {
        test: /\.svg(\?v=\d+\.\d+\.\d+)?$/,
        loader: "url?limit=10000&mimetype=image/svg+xml"
      }
    ]
  }
```

# API Reference

## dc.filterBuilder(parent)

filterBuilder provides two things that are lacking in a typical DC dashboard:

* A clear display of current filter state in one place
* A searchable menu method for filtering on any value of any chart

You can see it in action [here](https://explorer.usaid.gov/aid-trends.html) and [here](https://explorer.usaid.gov/aid-dashboard.html)

### .filterSources(filterableCharts)

Wires up the filterBuilder to handle filter creation and display for a set of charts. 

| Param           | Type  | Description |
|-----------------|-------|-------------|
| filterableCharts | Array | An array of objects like  __{chart: *SomeDcJsChart*, label:  *StringLabelForChart* }__ |

```
// Example Usage

var filterBuilder = dc.filterBuilder('#filter-builder-id')
  .filterSources([{chart: fooChart, label: "Foo"}, 
                  {chart: barChart, label: "Bar"}, 
                  {chart: bazChart, label: "Baz"}]);
```

## dc.pieChart(parent, options) 
Pie chart component now has custom options passed to it. 

| Param           | Type   | Description                                               |
|-----------------|--------|-----------------------------------------------------------|
| options         | object | Takes an object that looks like {innerRadiusRatio: number}. The innerRadiusRatio is the size of the inner radius compared to what the outer radius will be. The outer radius is always going to be 100% of the parent container. |

### .centerTitle(title)
Add a title to the center of the pie chart. 

| Param           | Type   | Description                                               |
|-----------------|--------|-----------------------------------------------------------|
| title           | string | A label that will be placed in the center of the pie chart|

```
//Example Usage
var dc = require('qd-components');
...
var worldRegions = dc.pieChart('#' + parentId, {innerRadiusRatio: 3/5})
	.dimension(regionDimension)
	.group(regionGroup)
	.title(function(d){return d.region;})
	.centerTitle('Regions');
```

## dc.kpiGauge(parent, dimension, group, options)
KpiGauge is a combination chart. It uses the DC number display in conjunction with our custom DC bar gauge. 

| Param           | Type      | Description                                               |
|-----------------|-----------|-----------------------------------------------------------|
| dimension       | object    | Use any dummy dimension for this parameter. All that matters is the data from the dimension object as there is no dimensional data to be displayed, only measure.|
| group           | object    | The group object will be used for the value displayed in the number display, and for the total capacity value of the bar gauge. |
| options         | object    | {title: "Display Title", formatter: d3.format(",")} The title text will be displayed under the number display. The formatter will be used to format the number display value. Recommended to import the qd-formatters library for this |

```
//Example Usage
var dc = require('qd-components');
...
var countryFundingKpi = dc.kpiGauge('#' + parentId, countryDimension, totalFundingSumGroup, {title: "Total Funding", formatter: formatters.bigCurrencyFormat});
```

## dc.geoBubbleOverlayChart(parent, options)
QdComponents adds some default styles to DC's geoBubbleOverlayChart, and also a way to add label lookup data for custom tooltip labels.

## .lookupTable(dataKey, dataValueKeys, data)
Create a lookup table that the chart can use to grab data values based on a data key. This is useful for creating custom tooltips that use the lookup table to create custom labels based on lookup id's. 
Set the labelLookupKey when using the lookupTable function.

| Param           | Type             | Description                                               |
|-----------------|------------------|-----------------------------------------------------------|
| dataKey         | string           | This data key will be used to create keys in the lookup table based on the value found in the chart data for this key.      |
| dataValueKeys   | array            | These keys will be used to add the corresponding data values from the chart data. |
| data            | array of objects | Usually the chart data. This data should contain the objects with the dataKey, and dataValueKeys |

### .labelLookupKey(columnName)
Set the labelLookupKey when using the lookupTable function

| Param           | Type   | Description                                               |
|-----------------|--------|-----------------------------------------------------------|
| columnName      | string | A label that will be placed in the center of the pie chart|

```
//Example Usage
var dc = require('qd-components');
...
var countryChart = dc.geoBubbleOverlayChart('#' + parentId)
	.dimension(countryDimension)
	.group(countryGroup)
	.setGeoJson(geoJson, layerName, dataAccessorFunc);
countryChart.lookupTable(keyColumn, dataValueKeys, countryDimension.top(Infinity))
	.labelLookupKey(labelKeyColumn);

```

## dc.dynatableComponent(parent)

DynatableComponent turns a simple table into a dimensional table that responds to your DC charts. This means any time your DC charts get filtered, the data in the Dynatable also gets filtered. 

You can see it in action [here](https://explorer.usaid.gov/aid-dashboard.html)

### .dimension(dimension)

Pass the crossfilter dimension to dynatableComponent. This dimension should be something different than any of your chart dimensions. A dimension that uses a column for data IDs would be suitable.

| Param           | Type   | Description                 |
|-----------------|--------|-----------------------------|
| dimension       | object | Crossfilter dimension object|

### .group(group)

Pass the crossfilter group to dynatableComponent. 

| Param           | Type   | Description                 |
|-----------------|--------|-----------------------------|
| group           | object | Crossfilter group object    |

### .columns(columns)

Pass an array of column objects to dynatableComponent, describing what columns to use from the data, and the display label of those columns. 

| Param           | Type   | Description                 |
|-----------------|--------|-----------------------------|
| columns         | Array  | Array of objects with the properties label and csvColumnName. The label is what the column header will be in the table. The csvColumnName is the name of the column in the data.    |

### .shortLoad(initialRecordSize)

Pass an initial record size to dynatableComponent. If initialRecordSize is set to true, the record set will be defaulted to 10, otherwise you can specify a specific initial record size. 

| Param            | Type              | Description                 |
|----------------- |-------------------|-----------------------------|
| initialRecordSize| boolean or number | Initial record set. Use this if you have a huge amount of data you don't want to block the page load.    |

```
//Example Usage

var dc = require('qd-components');

var data = crossfilter(someData);
var tableListingDimension = data.dimension(function(d) { return d.data_column_name;});
var tableListingGroup = tableListingDimension.group();

var dynatable = dc.dynatableComponent('#dynatable-id')
				.dimension(tableListingDimension)
				.group(tableListingGroup);
dynatable.columns([{label: "Foo", csvColumnName: "foo_name"},
					   {label: "Bar", csvColumnName: "bar_column"}]);

//optional ability to only load the first 10 records for speedier initial load
//you can then manually load all the rest of your records by doing dynatable.redraw() after the initial rendering
dynatable.shortLoad(true);

```

## dc.audioDash(parent)
AudioDash will enable your DC charts to be read by a screen reader. 

### .charts(chartsConfig)
Pass an object containing your chart config to audioDash. Multiple charts can be passed, just make a property for each one.

| Param            | Type              | Description                 |
|----------------- |-------------------|-----------------------------|
| chartsConfig     | object            | The property names of this object should be the title of the chart that will be read to the screen reader. The values of each object should be another object containing the DC chart to format and the formatter function. The formatter function will access the key and value data from a chart, and you can customize how it should be read by the screen reader by the return string of the formatter function. |


```
//Example Usage
var dc = require('qd-components');

var formatterFunction = function(key, value) { return key + ": " + value};
var audioDash = dc.audioDash('#audio-dash-id')
				  .charts({
				  		"Foo title": {chart: fooChart, formatter: formatterFunction},
				  		"Bar title": {chart: barChart, formatter: formatterFunction}
				  });

```

# The pipeline
QdComponents go through a pipeline to modify the dc charts. The dc charts get default to make the charts useable out of the box and other modifications such as sizebox support and tool tip support are also added out of the box by default. The sizeBoxify and toolTipsify parts of the pipeline also have options for more customization. 

## [dcChart].quickDefaults(quickDefaultsConfig)
Note: no custom options available yet. 
The quickdefaults module will give charts sensible defaults out of the box. 
*rowChart* has elasticX set to true so that the x axis will correctly scale depending on the width of the chart. 
*pieChart* has the renderLabel set to false so that there is no top label on the chart. It is recommended to use pieChart.centerLabel(String) so the chart gets a label placed in the center.
*geoChoropleth* 
*has a blue monochromatic color scale
*the color calculator dynamically updates on render, meaning the 'heat map' styles are relative to the current values in the chart. 
*the projection is d3.geo.mercator
*zoom is enabled by default

## [dcChart].sizeBoxify(sizeBoxifyConfig)
Note: no custom options available yet. 
The sizeBoxify module will automatically make your charts resize themselves based on the size of their parent container. This means you use your markup styling to control the size of your charts.

## [dcChart].toolTipsify(toolTipConfig)
Makes it easy to add high quality tooltips to any of your DC charts. 

You can see it in action [here](https://explorer.usaid.gov/aid-dashboard.html)

By default all supported charts come with an automatic toolTipsify setup using default __toolTipConfig__ values as described below.

To customize tool tip config call __yourchart.toolTipsify(toolTipConfig)__. The config allows you to customize the tooltip value formatter, content, position, and offset.

| Param         | Type    | Description             |
|---------------|---------|-------------------------|
| toolTipConfig | object  | This object can have optional properties for a content function, number formatting function, positioning, and offset.|

### toolTipConfig object properties
* **content:** function(chartData)
The content function will tell toolTipsify how to deal with data coming from the chart. This is useful when data should be manipulated or displayed in a certain way in the tooltip. 

* **position:** "mouse" or any ordinal coordinates like 'n', 's', 'e', 'w', or combos like 'ne' etc. 
Set the position to 'mouse' if you want the tool tip to follow the mouse. The ordinal coordinates will fix the tooltip in a specific location.

* **offset:** [y, x]
Add coordinate offsets for custom positioning of the tooltip.

* **formatter:** function(chartData)
The formatter function is useful for formatting a chart data value. This function will only have an effect if the default content function is being used, and a custom one is not provided. The default formatter will default to d3.format(",") 

```
// Example Usage

var dc = require('qd-components');

var myFooChart = dc.barChart('#myFooChart');
var myBazChart = dc.pieChart('#myBazChart');

/******* dimension & group setup here ********/

// custom formatter
myBazChart.toolTipsify({
  formatter: d3.format('$,')
});

// fully custom example
myFooChart.toolTipsify({
  position: 'n', 
  offset: [5, 0], 
  content: function(d){ /** return content here **/} 
});
 
```

### QuickDash DC Components that are Supported

| chart       		| toolTipsify Supported?   | sizeBoxify Supported ?| Urgency (toolTipsify) |
|-----------------------|--------------------------|-----------------------|---------|
| rowChart    		| yes			   | yes      		   |         |
| barChart   		| yes			   | yes            	   |         | 
| pieChart    		| yes			   | yes    	           |         |
| lineChart             | no			   | no            	   | cold    |
| bubbleChart           | no			   | no             	   | cold    |
| bubbleOverlay         | no			   | no   		   | cold    |
| geoChoroplethChart	| yes			   | yes     		   |         |
| geoBubbleOverlayChart | yes			   | yes    		   | cold    |
| heatmap		| no 			   | no          	   | cold    |
| scatterPlot		| no 			   | no	         	   | cold    |
| seriesChart		| no 			   | no	         	   | cold    |
| treeMap		| no 			   | no	         	   | cold    |
| sankey		| no 			   | no	        	   | cold    |
| boxPlot               | no			   | no	         	   | cold    |
| compositeChart        | no			   | no	         	   | cold    |

## Todo

|Component            | Implemented | Demo | Unit Tests | Documented | Assigned    | Priority |
|---------------------|:-----------:|:----:|:----------:|:----------:|-------------|----------|
| filterBuilder       | ✔           | ✔    | partial    | ✔          | jackcompton | Hot      |
| dynaTableComponent  | ✔           | ✔    |            | ✔          | tehandyb    | Hot      |
| audioDash           | ✔           | ✔    |            | ✔          | tehandyb    | Cold     |
| sizeBoxify          |             |      |            | ✔          | jackcompton | Hot      |
| toolTipsify         | ✔           | ✔    |            | ✔          | tehandyb    | Cold     |



