var dc = require('dc'),
    inflection = require('inflection');

// styles
require('../../src/stylesheets/filter-builder.scss');

require('font-awesome/css/font-awesome.css');
require('../../src/stylesheets/common.scss');
require('normalize.css/normalize.css');

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
    };

    _chart._doRender = function () {
        var hasFilters = false;
        var filtered = _filterSources.filter(function(d){ return d.chart.filters().length > 0;});
        var notFiltered = _filterSources.filter(function(d){ return d.chart.filters().length === 0;});
        if (filtered.length > 0) hasFilters = true;

        _chart.root().classed('filter-builder', true);
        _chart.root().html('');
        _chart.root().append('h2').html('<i class="fa fa-2x fa-filter"></i><span class="hide-visually">Filter</span>');
        var list = _chart.root().append('ul');

        var addFilterButton = list.append('li').classed('add-filter', true);
        addFilterButton.append('i')
          .classed({'fa': true, 'fa-plus': true});
        filterMenu(addFilterButton, notFiltered);

        if (hasFilters) {
          var filteredFieldsRoot = list.selectAll('li.filtered-field')
              .data(filtered)
            .enter().append('li').classed('filtered-field', true);

          var fieldLabels = filteredFieldsRoot.selectAll('span.field-label')
              .data(function(d){return [d];})
            .enter().append('span').classed('field-label', true)
            .text(function(d){return d.label;});

          var filteredFields = filteredFieldsRoot.selectAll('ul')
             .data(function(d){return [d];})
            .enter().append('ul')
            .classed('filter-value-list', true);

          var filterValues = filteredFields.selectAll('li.filter-value')
              .data(function(d){return d.chart.filters().map(function(v){return {chart: d.chart, filterValue: v};});})
            .enter().append('li')
            .classed('filter-value', true)
            .text(function(d){return tryLabel(d);})
            .on('click', function(d){
              d.chart.filter(d.filterValue); // dc base .filter() function works for removal as well as addition of filters
              dc.redrawAll();
              d3.event.stopPropagation();
            });

          var addValueButton = filteredFields.selectAll('li.add-value')
            .data(function(d){return [d];})
            .enter()
            .append('li')
            .classed({'add-value': true, 'filter-value': true})  
            .append('i')
            .classed({'fa': true, 'fa-plus': true})
            .on("click", function(){
              showValueOptions(this);
              d3.event.stopPropagation();
            });
            
          valuePicker(addValueButton);


          var clearFilterButton = filteredFieldsRoot.selectAll('span.close')
            .data(function(d){return [d.chart];})
            .enter()
            .append('span')  
            .classed({'close': true})
            .on('click', function(chart){
              chart.filterAll();
              dc.redrawAll();
              d3.event.stopPropagation();
            })
            .append('i')
            .classed({'fa': true, 'fa-times': true});
        }

        return _chart;
    };

    function tryLabel(filterItem){
      if (filterItem.chart.label && filterItem.chart.label() !== undefined){
        return filterItem.chart.label()({key: filterItem.filterValue}) || "N/A";
      } 
      return filterItem.filterValue || "N/A";
    }

    function optionSort(a, b){
      var aLabel = tryLabel(a);
      var bLabel = tryLabel(b);

      if (aLabel > bLabel) {
        return 1;
      }
      if (aLabel < bLabel){
        return -1;
      }
      return 0;
    }

    _chart._doRedraw = function(){
        return _chart._doRender();
    };

    // Filter Menu
    function filterMenu(parent, options){
      var _parentElement;
      if (parent.on === undefined) {
        _parentElement = d3.select(parent);
      } else {
        _parentElement = parent;
      } 
      
      var _dimensionListContainer = _parentElement.append('div')
        .classed({'picker-choices': true, 'dimension-list-container': true}).style('display', 'none');

      var _dimListHeader = _dimensionListContainer.append('div')
        .classed('header', true)
        .on('click', function(){
          _dimensionListContainer.style('display', 'none');
          _dimensionList.selectAll('div.picker-choices').style('display', 'none');
          _dimensionList.selectAll('li.selected').classed('selected', false);
          d3.event.stopPropagation();
        });

      _dimListHeader.append('div')
        .classed({'fa': true, 'fa-times': true, 'close-button': true});

      _dimListHeader.append('div')
        .text('Add a Filter on')
        .classed({'header-label': true});

      var _dimensionList = _dimensionListContainer.append('ul')
        .classed({'dimension-list': true});

      var _dimensionOptions = _dimensionList.selectAll('li.dimension-option')
          .data(options)
        .enter().append('li')
        .attr('class', function(d){
          return (d.options && d.options.class);
        })
        .classed('dimension-option', true)
        .text(function(d){return d.label;})
        .on('click', function(d){
          showValueOptions(this, _parentElement);
          d3.event.stopPropagation();
        });

      valuePicker(_dimensionOptions);


      _parentElement.on('click', function(){
        blurMenus();
        d3.select('.dimension-list-container').style("display", "block");
        try{
          d3.event.stopPropagation();
        } catch(e) {
          // swallow
        }
      });

    }

    function valuePicker(selection){

      var _valueListContainer = selection.selectAll('div.value-list-container')
          .data(function(d){return [d];})
        .enter().append('div')
        .classed({'picker-choices': true,'value-list-container': true}).style("display", "none");

      var _valueListHeader = _valueListContainer.selectAll('div.header')
          .data(function(d){return [d];})
        .enter().append('div')
        .classed('header', true)
        .on('click', function(){
          _valueListContainer.style('display', 'none');
          _valueList.selectAll('div.picker-choices').style('display', 'none');
          _valueList.selectAll('li.selected').classed('selected', false);
          d3.event.stopPropagation();
        });

      _valueListHeader.append('div')
        .append('i')
        .classed({'fa': true, 'fa-times': true, 'close-button': true});
        

      _valueListHeader.append('div')
        .text(function(d){return 'Choose a value for "' + d.label +'"';})
        .classed({'header-label': true});;

      var _listFilterContainer = _valueListContainer
        .append('div')
        .classed('listFilterContainer', true);

      _listFilterContainer
        .append('i')
        .classed('fa fa-2x fa-search', true);

      _listFilterContainer
          .data(function(d){return [d];})
        .append('input')
        .attr('placeholder','Filter the list below...')
        .on("click", function(d) {
          d3.event.stopPropagation();
        })
        .on('input', function(d){
          that = this;
          dc.events.trigger(function(){
            selection.select('ul.'+dc.utils.nameToId(d.label)).selectAll('li.value-option')
              .classed('hidden', function(d){
                var re = new RegExp(that.value, 'i');
                return this.textContent.search(re) < 0; 
              });
          }, 200);
        });

      var _valueList = _valueListContainer.selectAll('ul.value-list')
          .data(function(d){return [d];})
        .enter().append('ul')
        .attr('class', function(d){return dc.utils.nameToId(d.label);})
        .classed({'value-list': true});
    
      var _valueOptions = _valueList.selectAll('li.value-option')
          .data(function(d){
            return d.chart.group().top(Infinity)
              .map(function(i){ return {chart: d.chart, filterValue: i.key};})
              .filter(function(i){
                return i.chart.filters().indexOf(i.filterValue) < 0;
              })
              .sort(optionSort);
          })
        .enter().append('li')
        .text(function(d){return tryLabel(d);})
        .classed('value-option', true)
        .on('click', function(d){
          d.chart.filter(d.filterValue);
          dc.redrawAll();
          d3.event.stopPropagation();
        });
        
    }

    function showValueOptions(element, parentElement){
      var _element;
      if (element.on === undefined) {
        _element = d3.select(element);
      } else {
        _element = element;
      } 
      if (parentElement) {
        parentElement.selectAll('ul.dimension-list .value-list-container').style('display', 'none');
        parentElement.selectAll('ul.dimension-list li').classed('selected', false);
      }  
      else {
        blurMenus();
      }

      _element.select('.value-list-container').style('display','block');
      _element.classed('selected', true);
    }

    function blurMenus() {
      d3.selectAll(".value-list-container")[0].forEach(function(valueOptionList) {
        d3.select(valueOptionList).style('display', "none");
      });

      d3.select('.dimension-list-container').style("display", "none");

    }

    d3.select("html").on("click", function(){
      d3.selectAll('.picker-choices').style('display', 'none');
    });

    return _chart.anchor(parent, chartGroup);
  }; 
