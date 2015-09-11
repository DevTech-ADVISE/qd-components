# qd-components

|Component            | Implemented | Demo | Unit Tests | Documented | Assigned    | Priority |
|---------------------|:-----------:|:----:|:----------:|:----------:|-------------|----------|
| filterBuilder       | ✔           | ✔    | partial    | ✔          | jackcompton | Hot      |
| dynaTableComponent  | ✔           | ✔    |            | ✔          | tehandyb    | Hot      |
| audioDash           | ✔           | ✔    |            | ✔          | tehandyb    | Cold     |
| sizeBox             |             |      |            |            | jackcompton | Hot      |
| toolTips            |             |      |            |            | tehandyb    | Cold     |

# API Reference

## qd.filterBuilder(parent)

filterBuilder provides two things that are lacking in a typical DC dashboard:

* A clear display of current filter state in one place
* A searchable menu method for filtering on any value of any chart

You can see it in action [here](https://explorer.usaid.gov/aid-trends.html) and [here](https://explorer.usaid.gov/aid-dashboard.html)

### .filterSources(filterableCharts)

Wires up the filterBuilder to handle filter creation and display for a set of charts. 

| Param           | Type  | Description |
|-----------------|-------|-------------|
| filterabeCharts | Array | An array of objects like  __{chart: *SomeDcJsChart*, label:  *StringLabelForChart* }__ |

```
// Example Usage

var filterBuilder = qd.filterBuilder('#filter-builder-id')
  .filterSources([{chart: fooChart, label: "Foo"}, 
                  {chart: barChart, label: "Bar"}, 
                  {chart: bazChart, label: "Baz"}]);
```

## dynatableComponent
Simply pass the dynatable a crossfilter dimension and group. Also add the column names that you would like to show in the table.

```
var qd = require('qd-components');

var data = crossfilter(someData);
var tableListingDimension = data.dimension(function(d) { return d.data_column_name;});
var tableListingGroup = tableListingDimension.group();

var dynatable = qd.dynatableComponent('#dynatable-id')
				.dimension(tableListingDimension)
				.group(tableListingGroup);
dynatable.columns([{label: "Foo", csvColumnName: "foo_name"},
					   {label: "Bar", csvColumnName: "bar_column"}]);

//optional ability to only load the first 10 records for speedier initial load
//you can then manually load all the rest of your records by doing dynatable.redraw() after the initial rendering
dynatable.shortLoad(true);
dynatable.shortLoad(100); //can set custom initial record size
```

## audioDash
Simply pass the charts that you would like to be readable by an audio browser, to the audioDash component. Also pass in a formatter to specify how the data should be read. 

```
var qd = require('qd-components');

var formatterFunction = function(key, value) { return key + ": " + value};
var audioDash = qd.audioDash('#audio-dash-id')
				  .charts({
				  		"Foo title": {chart: fooChart, formatter: formatterFunction}
				  });

```

