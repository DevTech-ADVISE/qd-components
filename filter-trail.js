var dc = require('dc'),
    inflection = require('inflection');

module.exports = function (parent, chartGroup) {
  
    var _chart = dc.baseMixin({});    
    var _filterSources = [];
    _chart._mandatoryAttributes([]);

    _chart.filterSources = function(_) {
        // _ is of the following format:
        // [{chart: yourDcChartObject, icon: 'fontawesome-class', label: 'Your Label'}]
        if (!arguments.length) return _filterSources;
        _filterSources = _;
        return _chart;
    }

    _chart._doRender = function () {
        var hasFilters = false;
        //var filterSources = [{name: 'country', icon: 'globe', label: 'Country'},{name: 'economic-sector', icon: 'cube', label: 'Sector'},{name: 'implementing-agency', icon: 'institution', label: 'Agency'}]
        var filtered = _filterSources.filter(function(d){ return d.chart.filters().length > 0});
        if (filtered.length > 0) hasFilters = true;

        _chart.root().classed('filter-trail', true);
        _chart.root().html('');
        var list = _chart.root().append('ul')

        if (hasFilters) {
          var filteredFieldsRoot = list.selectAll('li.filtered-field')
              .data(filtered)
            .enter().append('li').classed('filtered-field', true);

          var fieldLabels = filteredFieldsRoot.selectAll('span.field-label')
              .data(function(d){return [d];})
            .enter().append('span').classed('field-label', true)
            .text(function(d){return d.label});

          var filteredFields = filteredFieldsRoot.selectAll('ul')
             .data(filtered)
            .enter().append('ul')
            .classed('filter-value-list', true);

          var filterValues = filteredFields.selectAll('li.filter-value')
              .data(function(d){return d.chart.filters().map(function(v){return {chart: d.chart, value: v};});})
            .enter().append('li')
            .classed('filter-value', true)
            .text(function(d){return d.value;})
            .on('click', function(d){
              d.chart.filter(d.value); 
              dc.redrawAll();
            });

          var addValueButton = filteredFields.selectAll('li.add-value')
            .data(function(d){return [d.chart];})
            .enter()
            .append('li')
            .classed({'add-value': true, 'filter-value': true})  
            .attr('id', function(d){return d.dataConfigKey()})
            .each(function(d, i){
              var opts = d.group().top(Infinity).map(function(i){return i.key});
              dropPicker(this)
                .options(opts)
                .onPick(function(value){
                  d.filter(value);
                  dc.redrawAll();
                })
                .render();
            })
            .append('i')
            .classed({'fa': true, 'fa-plus': true});
            
          var clearFilterButton = filteredFieldsRoot.selectAll('span.close')
            .data(function(d){return [d.chart];})
            .enter()
            .append('span')  
            .classed({'close': true})
            .on('click', function(chart){
              chart.filterAll();
              dc.redrawAll();
            })
            .append('i')
            .classed({'fa': true, 'fa-times': true});
        }

        return _chart;
    };

    _chart._doRedraw = function(){
        return _chart._doRender();
    };

    return _chart.anchor(parent, chartGroup);
  } 
