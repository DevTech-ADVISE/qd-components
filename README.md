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
//Example Useage

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

## audioDash
Simply pass the charts that you would like to be readable by an audio browser, to the audioDash component. Also pass in a formatter to specify how the data should be read. 

```
var dc = require('qd-components');

var formatterFunction = function(key, value) { return key + ": " + value};
var audioDash = dc.audioDash('#audio-dash-id')
				  .charts({
				  		"Foo title": {chart: fooChart, formatter: formatterFunction}
				  });

```

## sizeBoxify

## toolTipsify

Provides easy addition of customizable tooltips to any DC chart component instance.

```
var dc = require('qd-components');

var myFooChart;

//
// crossfilter & chart setup here 
//

// Minimal setup example. 
// Content for tooltips defaults sensibly: 
//  - dimension value displayed as a label/title, 
//  - group value displayed as value
//  - tip position defaults to "mouse follow" style
dc.toolTipsify(myFooChart);

// Override defaults with custom settings
dc.toolTipsify(myFooChart, {
	content: function(d) {
		// whatever you must here
	},
	position: YourChosenPositionSetting
});

```

## Todo

|Component            | Implemented | Demo | Unit Tests | Documented | Assigned    | Priority |
|---------------------|:-----------:|:----:|:----------:|:----------:|-------------|----------|
| filterBuilder       | ✔           | ✔    | partial    | ✔          | jackcompton | Hot      |
| dynaTableComponent  | ✔           | ✔    |            | ✔          | tehandyb    | Hot      |
| audioDash           | ✔           | ✔    |            | ✔          | tehandyb    | Cold     |
| sizeBoxify          |             |      |            |            | jackcompton | Hot      |
| toolTipsify         |             |      |            | ✔          | tehandyb    | Cold     |



