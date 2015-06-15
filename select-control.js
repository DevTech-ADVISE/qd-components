var dc = require('dc');

module.exports = function (parent, chartGroup) {

    var _chart = dc.baseMixin({});
    var _defaultValue;
    var _currentSelection;
 
    /**
        #### .defaultValue(primitive)
        Explicitly set default selection. If not set, defaults to the first item in the select options.

    **/
    _chart.defaultValue = function(_) {
    	if (!arguments.length) return _defaultValue;
    	_defaultValue = _;
    	return _chart;
    };


    _chart.currentSelection = function(_) {
      if(!arguments.length) return _currentSelection || _distinctDimensionValues()[0];
      //TODO: add ability to make a selection
    };
    function _distinctDimensionValues() {
      return _chart.group().all().map(function(o){return o.key;});
    }

    _chart._doRender = function () {

    	_chart.root().classed('select-control', true);
    	_chart.root().html('');

    	var selectionList = _chart.root().append('select');

    	if(_currentSelection === undefined) {
    		if(_defaultValue === undefined) {
    	    	_defaultValue = _distinctDimensionValues()[0];
    		}
			_currentSelection = _defaultValue;
    	}

    	selectionList.selectAll('option')
    	    .data(_distinctDimensionValues())
    	  .enter().append('option')
    	    .attr('selected', function(d){ return d === _currentSelection ? '' : null})
    	    .text(function(d){return d})
    	    .attr('value', function(d){return d;});

	    selectionList.on('change', function(){

	        _currentSelection = this.value;
     		// Avoid double-firing _invokeFilteredListener that comes with _chart.filterAll();
     		_chart.replaceFilter(this.value);

     		dc.redrawAll();
	    });

    };


    _chart._doRedraw = function(){
    	return _chart._doRender();
    };

    return _chart.anchor(parent, chartGroup);
};
