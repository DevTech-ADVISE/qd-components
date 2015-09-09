# qd-components

|Component            | Implemented | Demo | Unit Tests | Documented | Assigned    | Priority |
|---------------------|:-----------:|:----:|:----------:|:----------:|-------------|----------|
| filterBuilder       | ✔           | ✔    | partial    | ✔          | jackcompton | Hot      |
| dynaTableComponent  | ✔           | ✔    |            |            | tehandyb    | Hot      |
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
                  {chart: bazChart, label: "Baz"}])

```