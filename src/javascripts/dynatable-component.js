var $  = require('jquery');
window.jQuery = $;
var dc = require('dc'),
    dynatable = require('dynatable');

// styles
require('../../src/stylesheets/dynatable.scss');

module.exports = function(parent, chartGroup){

  var _chart = dc.baseMixin({});
  var _columns, _previousColumns = []; 
  var _dataTable;
  var _settings;
  var _initialRecordSize = "Infinity";
  var _cellWriter = defaultCellWriter;
  var _cellContent = function(cellValue, column, record) {return cellValue;};

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
    if(!arguments.length) return _initialRecordSize;
    if(_) {
      if(typeof _ === 'number') {
        _initialRecordSize = _;
      }
      else {
        _initialRecordSize = 10;
      }
    }
    return _chart;
  };

  _chart.cellWriter = function(_) {
    if(!arguments.length) return _cellWriter;
    _cellWriter = _;
    return _chart;
  };

  _chart.cellContent = function(_) {
    if(!arguments.length) return _cellContent;
    _cellContent = _;
    return _chart;
  };

  _chart.forceRender = function(_) {
    if(!arguments.length) return _forceRender;
    _forceRender = _;
    return _chart;
  };

  _chart._doRender = function() {
    var tableChanged = columnsChanged();
    // Insert Table HTML into parent node
    if (!_dataTable || tableChanged){
      _chart.root().html("");
      _chart.root().classed('dynatableComponent', true);
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
          },
          writers: {
            _cellWriter: _cellWriter
          }
      };

      $.extend(dynatableConfig, _settings);

      // Initialize jQuery DataTable
      _dataTable = $(parent + " table").dynatable(dynatableConfig).data('dynatable');

      _forceRender = false;
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

  function columnsChanged() {
    var columnNames = _columns.map(function(d) {return d.csvColumnName;});
    if(_previousColumns.length === 0) {
      _previousColumns = columnNames;
      return true;
    }

    //check for added columns
    for(var i = 0; i < columnNames.length; i++) {
      var columnName = columnNames[i];
      if(_previousColumns.indexOf(columnName) === -1) {
        _previousColumns = columnNames;
        return true;
      }
    }
    //check for removed columns
    for(var i = 0; i < _previousColumns.length; i ++) {
      var columnName = _previousColumns[i];
      if(columnNames.indexOf(columnName) === -1) {
        _previousColumns = columnNames;
        return true;
      }
    }

    return false;
  }

  function defaultCellWriter(column, record) {
    var cellValue = column.attributeWriter(record),
        td = '<td';

    if (column.hidden || column.textAlign) {
      td += ' style="';

      // keep cells for hidden column headers hidden
      if (column.hidden) {
        td += 'display: none;';
      }

      // keep cells aligned as their column headers are aligned
      if (column.textAlign) {
        td += 'text-align: ' + column.textAlign + ';';
      }

      td += '"';
    }

    return td + '>' + _cellContent(cellValue, column, record) + '</td>';
  };

  return _chart.anchor(parent, chartGroup);
}