var settings = require('../load-settings');

var reportFilterEvent = function(charts) {
	var filtersToReport = charts.map(function(c){
	  return c.filters().length > 0 ? c.headerLabel() : null;
	}).filter(function(f){return f !== null;});
	if (filtersToReport.length > 0){
		ga('send','event', 'dcjs', 'filter-dimensions-cluster', filtersToReport.join('||'));
	}
};

module.exports = function(dc, charts){
	var _charts = charts;
	dc.renderlet(function(){reportFilterEvent(_charts);});
};