var $  = require('jquery');
window.jQuery = $;
var dc = require('dc'),
    dynatable = require('dynatable');

// styles
require('../../src/stylesheets/dynatable.scss');
require('font-awesome/css/font-awesome.css');
require('../../src/stylesheets/common.scss');
require('normalize.css/normalize.css');

module.exports = function(parent, chartGroup){

  var _chart = dc.baseMixin({});
  var _columns; 
  var _dataTable;
  var _settings;
  var _initialRecordSize = "Infinity";

  /**
      #### .columns({label: String, csvColumnName: String})
      Explicitly set default selection. If not set, defaults to the first item in the select options.
  
  **/
  _chart.columns = function(_) {
    if (!arguments.length) return _columns;
    _columns = _;
    return _chart;
  };

  _chart.settings = function(_) {
    if (!arguments.length) return _settings;
    _settings = _;
    return _chart;
  };

  _chart.dataTable = function() {
    return _dataTable;
  };

  _chart.shortLoad = function(_) {
    if(_) {
      if(typeof _ === 'number') {
        _initialRecordSize = _;
      }
      else {
        _initialRecordSize = 10;
      }
    }
  };

  _chart._doRender = function() {
    // Insert Table HTML into parent node
    if (!_dataTable){
      _chart.root().html("");
      var table = _chart.root().append('table');
      table.attr("class", "dc-datatable");
      //id for the table is needed to allow for mutliple dynatables on one page
      table.attr("id", parent.replace("#", "") + "-id"); 

      var headerRow = table.append('thead').append('tr');
      headerRow.selectAll('th')
        .data(_columns).enter()
          .append('th')
          .attr("data-dynatable-column", function(d){return d.csvColumnName})
          .style({"text-align": function(d){return d.alignment}})
          .text(function(d){return d.label});

      //wasnt what the best way would be to pass the readers and writers from aid-explorer-dashboard
      var dynatableConfig = {
          features: {
              pushState: false,
              search: true
          },
          inputs: {
            paginationPrev: '<i class="fa fa-caret-square-o-left"></i>&#160;Previous',
            paginationNext: 'Next&#160;<i class="fa fa-caret-square-o-right"></i>',
            perPageText: 'records per page'
          },
          dataset: {
              records: _chart.dimension().top(_initialRecordSize),//.top(10),
              perPageDefault: 10,
              perPageOptions: [10, 50, 100, 200, 500]
          }
      };

      $.extend(dynatableConfig, _settings);

      // Initialize jQuery DataTable
      _dataTable = $(parent + " table").dynatable(dynatableConfig).data('dynatable');
    }  
    //_chart._doRedraw(); 
    RefreshTable(_initialRecordSize);   
  }

  _chart._doRedraw = function(){
    RefreshTable();
  }

  function RefreshTable(_) {
    var top = (_ || Infinity);
    dc.events.trigger(function () {
        _dataTable.settings.dataset.originalRecords = _chart.dimension().top(top);
        _dataTable.paginationPage.set(1);
        _dataTable.process();
    });
  };

  return _chart.anchor(parent, chartGroup);
}