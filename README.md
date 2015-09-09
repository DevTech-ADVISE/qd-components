# qd-components

|Component            | Implemented | Demo | Unit Tests | Documented | Assigned    | Priority |
|---------------------|:-----------:|:----:|:----------:|:----------:|-------------|----------|
| filterBuilder       | ✔           | ✔    | partial    | ✔          | jackcompton | Hot      |
| dynaTableComponent  | ✔           | ✔    |            | ✔          | tehandyb    | Hot      |
| audioDash           | partial     |      |            |            | tehandyb    | Cold     |
| sizeBox             |             |      |            |            | jackcompton | Hot      |
| toolTips            |             |      |            |            | tehandyb    | Cold     |

# Usage

## filterBuilder

Has only one method for configuration: __filterSources__.

Simply pass it an array of __objects__ each having a __chart__ and __label__ property. The __chart__ property values should all be dc/qd charts and the __label__ values should all be strings.

```
var qd = require('qd-components');

var fooChart, barChart, bazChart;

/*
 Crossfilter Dimensions, Groups, & Charts Setup Here
*/

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



