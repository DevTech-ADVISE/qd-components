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

## dc.sizeBoxify(chart)

Provides easy addition of dynamic resize capability to any DC chart component instance.

```
// Example Usage

var dc = require('qd-components');

var myFooChart;

// Minimal setup example. Will resize myFooChart based on dimensions of myFooChart.parent()
dc.sizeBoxify(myFooChart);

// Custom example
dc.sizeBoxify(myFooChart, function(){
	// custom resize code here
});
```

## [dcChart].toolTipsify(toolTipConfig)
Makes it easy to add high quality tooltips to any of your DC charts. 

You can see it in action [here](https://explorer.usaid.gov/aid-dashboard.html)

By default all supported charts come with an automatic toolTipsify setup using default __toolTipConfig__ values as described below.

To customize tool tip config call __yourchart.toolTipsify(toolTipConfig)__. The config allows you to customize the tooltip value formatter, content, position, and offset.

| Param         | Type    | Description             |
|---------------|---------|-------------------------|
| toolTipConfig | object  | This object can have optional properties for a content function, number formatting function, positioning, and offset.|

### content: function(chartData)
The content function will tell toolTipsify how to deal with data coming from the chart. This is useful when data should be manipulated or displayed in a certain way in the tooltip. 

### position: "mouse" or any ordinal coordinates like 'n', 's', 'e', 'w', or combos like 'ne' etc. 
Set the position to 'mouse' if you want the tool tip to follow the mouse. The ordinal coordinates will fix the tooltip in a specific location.

### offset: [y, x]
Add coordinate offsets for custom positioning of the tooltip.

### formatter: function(chartData)
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

### toolTipsify Support

| chart       			| toolTipsify Supported?   | Urgency |
|-----------------------|--------------------------|---------|
| rowChart    			| yes					   |         |
| barChart   			| yes					   |         | 
| pieChart    			| yes					   |         |
| lineChart             | no					   | cold    |
| bubbleChart           | no					   | cold    |
| bubbleOverlay         | no					   | cold    |
| geoChoroplethChart	| yes					   |         |
| geoBubbleOverlayChart | no					   | cold    |
| heatmap				| no 					   | cold    |
| scatterPlot			| no 					   | cold    |
| seriesChart			| no 					   | cold    |
| treeMap				| no 					   | cold    |
| sankey				| no 					   | cold    |
| boxPlot               | no					   | cold    |
| compositeChart        | no					   | cold    |

## Todo

|Component            | Implemented | Demo | Unit Tests | Documented | Assigned    | Priority |
|---------------------|:-----------:|:----:|:----------:|:----------:|-------------|----------|
| filterBuilder       | ✔           | ✔    | partial    | ✔          | jackcompton | Hot      |
| dynaTableComponent  | ✔           | ✔    |            | ✔          | tehandyb    | Hot      |
| audioDash           | ✔           | ✔    |            | ✔          | tehandyb    | Cold     |
| sizeBoxify          |             |      |            | ✔          | jackcompton | Hot      |
| toolTipsify         | ✔           | ✔    |            | ✔          | tehandyb    | Cold     |



