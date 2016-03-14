var inflection = require('inflection'),
  dtip = require('d3-tip')(d3);
var dc = require('dc');
var formatters = require('qd-formatters')(d3);

var quickDefaults = function() {
  
  var original = {};

  original.barChart = dc.barChart;
  dc.barChart = function(parent, opts) {
    var _chart = original.barChart(parent);
    var _xLabel = '', _yLabel = '';

    _chart.xLabel = function(_) {
      if(!arguments.length) return _xLabel;
      _xLabel = _;
      return _chart;
    };

    _chart.yLabel = function(_) {
      if(!arguments.length) return _yLabel;
      _yLabel = _;
      return _chart;
    };

    function addLabelAxisX(displayText) {
      if(_chart.select('.x-axis-label').empty()) {
        _chart.svg()
        .append("text")
        .attr("class", "axis-label x-axis-label")
        .attr("text-anchor", "middle")
        .attr("x", _chart.width() / 2)
        .attr("y", _chart.height())
        .text(displayText);
      }
      
    }

    function addLabelAxisY(displayText) {
      if(_chart.select('.y-axis-label').empty()) {
        _chart.svg()
        .append("text")
        .attr("class", "axis-label y-axis-label")
        .attr("text-anchor", "end")
        .attr("transform", "rotate(-90)")
        .attr("y", 2)
        .attr("x",-4)
        .attr("dy", ".625em")
        .text(displayText);
      }
      
    }

    _chart.on('preRedraw', function() {
      if(_xLabel !== '') {
        addLabelAxisX(_xLabel);
      }
      if(_yLabel !== '') {
        addLabelAxisY(_yLabel);
      }
    });
    _chart.renderTitle(false);

    return _chart;
  };

  original.rowChart = dc.rowChart;
  dc.rowChart = function(parent, opts) {
    var _chart = original.rowChart(parent);
    var _tickFormatFunc = function(d) {return formatters.numberFormat(d)};
    _chart.tickFormatFunc = function(_) {
      if(!arguments.length) return _tickFormatFunc;
      _tickFormatFunc = _;
      return _chart;
    };

    _chart.elasticX(true);
    _chart.renderTitle(false);
    _chart.xAxis().tickFormat(_tickFormatFunc);

    return _chart;
  };

  original.pieChart = dc.pieChart;
  dc.pieChart = function(parent, opts) {
    var _chart = original.pieChart(parent);
    var _centerTitle = '';
    _chart.centerTitle = function(_) {
      if(!arguments.length) return _centerTitle;
      _centerTitle = _;
      return _chart;
    };

    var renderletFunc = function() {
      if(opts && opts.renderletFunc) {
        opts.renderletFunc();
      }

      if(_centerTitle !== '') {
        var labelRoot = d3.select(parent + ' svg g');
        if(labelRoot.select('text.center-label').empty()) {

          if(!Array.isArray(_centerTitle)) {
            labelRoot.append('svg:text')
              .attr('class', 'center-label')
              .text(_centerTitle);
          }
          else {
            _centerTitle.forEach(function(text, index) {
              labelRoot.append('svg:text')
                .attr('class', 'center-label')
                .attr('dy', index + 'em')
                .text(text);
            });
          }

        }
      }
    };

    _chart.renderlet(renderletFunc);
    _chart.renderTitle(false);
    _chart.renderLabel(false)

    return _chart;
  };

  original.geoChoroplethChart = dc.geoChoroplethChart;
  dc.geoChoroplethChart = function(parent, opts) {
    var _chart = original.geoChoroplethChart(parent);
    var _lookupTable = {}, _labelLookupKey = 'id';

    _chart.lookupTable = function(keyColumn, valueColumns, data) {
      if(!arguments.length) return _lookupTable;

      data.forEach(function(row) {
        var key = row[keyColumn];
        var values = {};
        valueColumns.forEach(function(columnName) {
          values[columnName] = row[columnName];
        });
        _lookupTable[key] = values;
      });

      return _chart;
    };

    _chart.labelLookupKey = function(_) {
      if(!arguments.length) return _labelLookupKey;
      _labelLookupKey = _;
      return _chart;
    };

    _chart.label(function(d) {
      if(Object.keys(_lookupTable).length !== 0) {
        var lookupRow = _lookupTable[d.key]
        if(lookupRow !== undefined) {
          return lookupRow[_labelLookupKey];
        }
        return d.key;
        
      }
      return d.key;
      
    });
    //Add zoom markup
    _chart.root().append("div").classed("zoomControlsContainer", true);
    _chart.root().select(".zoomControlsContainer").append("div").classed("zoomButton", true);
    _chart.root().select(".zoomControlsContainer").append("div").classed("resetZoomButton", true);

    //Defaults for colors and data
    var _colorRange = ["#a9c8f4", "#7fa1d2", "#5479b0", "#2a518e", "#002A6C"];
    var _zeroColor = '#ccc';
    var _legendOffsetX = 30, _legendOffsetY = 200, _legendItemHeight = 25, _legendItemGap = 0;
    var _horizontalLegend = false;
    var _colorLegend = false;
    var _showLegendText = true;
    var _legendFormatter = formatters.bigCurrencyFormat;
    var _legendContent = function(d) {
      var label = (_chart.label()(d) !== undefined) ? _chart.label()(d) : _chart.label()(d.data);
      var value = (d.value !== undefined) ? d.value : d.data.value;
      return "<label>" + label + "</label><br/>" + _legendFormatter(value);
    };

    var _colorDomainFunc = function() { 
      return [d3.min(_chart.group().all(), function(d){return d.value}),
     d3.max(_chart.group().all(), function(d){return d.value})];
    };

    _chart.colorDomainFunc = function(_) {
      if(!arguments.length) return _colorDomainFunc;
      _colorDomainFunc = _;
      return _chart;
    };

    _chart.colorRange = function(_) {
      if(!arguments.length) return _colorRange;
      _colorRange = _;
      return _chart;
    };

    _chart.zeroColor = function(_) {
      if(!arguments.length) return _zeroColor;
      _zeroColor = _;
      return _chart;
    };

    _chart.colorLegend = function(_) {
      if(!arguments.length) return _colorLegend;
      _colorLegend = _;
      return _chart;
    };

    _chart.horizontalLegend = function(_) {
      if(!arguments.length) return _horizontalLegend;
      _horizontalLegend = _;
      if(_ === true) {
        _legendOffsetY = 70;
      }
      else {
        _legendOffsetY = 200; 
      }
      return _chart;
    };

    _chart.showLegendText = function(_) {
      if(!arguments.length) return _showLegendText;
      _showLegendText = _;
      return _chart;
    };

    _chart.legendFormatter = function(_) {
      if(!arguments.length) return _legendFormatter;
      _legendFormatter = _;
      return _chart;
    };

    _chart.legendContent = function(_) {
      if(!arguments.length) return _legendContent;
      _legendContent = _;
      return _chart;
    };

    var colorCalculatorFunc = function (d) {
      if(d === undefined) return _zeroColor;
      if(d < 1 )return _zeroColor;
      return _chart.colors()(d); 
    };

    var legendablesFunc = function() {
      //legendables are a list of objects in the format {name: name, data: data, chart: chart, color: color}
      var colorList = _chart.colorRange().slice();
      colorList.unshift(_chart.zeroColor());

      var legendables = colorList.map(function(color) {
        var textLabel = (_showLegendText === true) ? getColorLegendLabel(color) : "";

        if(color === _chart.zeroColor()) {
          return {name: textLabel, data: undefined, chart: _chart, color: color, label: "No Data"};
        }
        
        return {name: textLabel, 
          data: undefined, 
          chart: _chart, 
          color: color, 
          label: getColorLegendLabel(color)};
      });

      //Return the final array of legendables, reversed only for vertical legend
      return (_horizontalLegend) ? legendables : legendables.reverse();
    };

    var getColorLegendLabel = function(colorCode) {
      if(colorCode === _chart.zeroColor()) return "No Data";

      var colorDomain = _chart.colors().invertExtent(colorCode).map(function(value) { return _legendFormatter(value);});
      return colorDomain[0] + " to " + colorDomain[1];
    }

    _chart.colors(d3.scale.quantize().range(_colorRange))
      .colorCalculator(colorCalculatorFunc)
      .projection(d3.geo.mercator())
      .enableZoom(true)
      .afterZoom(function(g, s){
        g.selectAll('.country').selectAll('path').style('stroke-width',0.75 / s + 'px');
      })
      .on("preRender", function() {
        _chart.colorDomain(_colorDomainFunc());

        if(_colorLegend === true) {
          _chart.legendables = legendablesFunc;
          _chart.legend(dc.legend()
                          .x(_legendOffsetX)
                          .y(_chart.getDynamicHeight() - _legendOffsetY)
                          .itemWidth(_legendItemHeight)
                          .itemHeight(_legendItemHeight)
                          .gap(_legendItemGap)
                          .horizontal(_horizontalLegend));
        }
      })
      .on("preRedraw", function() {
        _chart.colorDomain(_colorDomainFunc());
      });

    return _chart;
  };

  original.geoBubbleOverlayChart = dc.geoBubbleOverlayChart;
  dc.geoBubbleOverlayChart = function(parent, opts) {
    var _chart = original.geoBubbleOverlayChart(parent);
    var _lookupTable = {}, _labelLookupKey = 'id', _radiusValueModifier = 1;

    _chart.lookupTable = function(keyColumn, valueColumns, data) {
      if(!arguments.length) return _lookupTable;

      data.forEach(function(row) {
        var key = row[keyColumn];
        var values = {};
        valueColumns.forEach(function(columnName) {
          values[columnName] = row[columnName];
        });
        _lookupTable[key] = values;
      });

      return _chart;
    };

    _chart.labelLookupKey = function(_) {
      if(!arguments.length) return _labelLookupKey;
      _labelLookupKey = _;
      return _chart;
    };

    _chart.label(function(d) {
      if(Object.keys(_lookupTable).length !== 0) {
        var lookupRow = _lookupTable[d.key]
        if(lookupRow !== undefined) {
          return lookupRow[_labelLookupKey];
        }
        return d.key;
        
      }
      return d.key;
      
    });

    _chart.radiusValueModifier = function(_) {
      if(!arguments.length) return _radiusValueModifier;
      _radiusValueModifier = _;
      return _chart;
    };

    _chart
      .projection(d3.geo.mercator())
      .bubbleLabel(function(d) { return _chart.keyAccessor()(d)})
      .renderTitle(false)
      .radiusValueAccessor(function(d){
        var r = Math.sqrt(d.value/_radiusValueModifier); //separate radius values more with sqrt curve
        if (r < 0) return 0;
        return Math.abs(r);
      });

    return _chart;
  };

  return dc;
};

module.exports = quickDefaults;