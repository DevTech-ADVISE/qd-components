var dcOrig = require('dc');
var sizeBoxify = require('./size-boxify.js');
var dc = sizeBoxify(dcOrig);
var formatters = require('qd-formatters')(d3);

var timelineComponent = function(playerParentId, timelineId, dimension, group, xLabel, yLabel, options) {
	var _chart = {playerControl: {}, timeline: {}, yearDisplay: {}};
  var playerControlClass = 'player-control', selectionDisplayClass = 'selection-display';
  var _domainListFunc = function(g) {
   return g.top(Infinity).map(function(d){return d.key;}).sort();};
  var _domainList = _domainListFunc(group);
  var _initialFilterValue = (options && options.initialFilterValue) ? options.initialFilterValue : _domainList[_domainList.length-2];
  var _yearPlayerState;
  var _tickMarks_xFunc = function(domainList) { 
    var width = window.outerWidth;
    var domainList = _domainListFunc(group);
    var tickMarks = domainList;
    if(width < 650) {
      tickMarks = [];
      for (var i = (domainList.length % 5); i < domainList.length; i = i+5) {
        tickMarks.push(domainList[i]);
      };
      return tickMarks;
    }
    else if (width < 1100) {
      tickMarks = [];
      for (var i = (domainList.length % 2); i < domainList.length; i = i+2) {
        tickMarks.push(domainList[i]);
      };
      return tickMarks;
    }
  };
  var _tickMarks_yFunc = function() { 
    var tickLimit = group.top(1).map(function(d){return d.value});
    var tickMarks = [0, (tickLimit/4), tickLimit/2, ((tickLimit/4)*3), tickLimit];
    if (window.outerHeight < 400) {
        tickMarks = [0, tickLimit];
    } else if (window.outerHeight < 600) {
        tickMarks = [0, (tickLimit/3), ((tickLimit/3)*2), tickLimit];
    }

    return tickMarks;
  };
  var _tickFormat_xFunc = function(tickValue) { return "'" + tickValue.toString().slice(-2);};
  var _tickFormat_yFunc = function(tickValue) { return formatters.bigNumberFormat(tickValue);};

  _chart.domainListFunc = function(_) {
    if(!arguments.length) return _domainListFunc;
    _domainListFunc = _;
    return _chart;
  };

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

  _chart.tickMarks_xFunc = function(_) {
    if(!arguments.length) return _tickMarks_xFunc;
    _tickMarks_xFunc = _;
    return _chart;
  }

  _chart.tickMarks_yFunc = function(_) {
    if(!arguments.length) return _tickMarks_yFunc;
    _tickMarks_yFunc = _;
    return _chart;
  }

  _chart.tickFormat_xFunc = function(_) {
    if(!arguments.length) return _tickFormat_xFunc;
    _tickFormat_xFunc = _;
    return _chart;
  }

  _chart.tickFormat_yFunc = function(_) {
    if(!arguments.length) return _tickFormat_yFunc;
    _tickFormat_yFunc = _;
    return _chart;
  }

  _chart.timeline = dc.barChart(timelineId)
    .dimension(dimension).group(group)
    .elasticY(true)
    .x(d3.scale.ordinal().domain(_domainListFunc(group)))
    .xUnits(dc.units.ordinal)
    .xLabel(xLabel)
    .yLabel(yLabel)
    .outerPadding(0)
    .transitionDuration(0);
  _chart.timeline.margins().right = 2;
  _chart.timeline.margins().left = 50;
  _chart.timeline.xAxis().tickValues(_tickMarks_xFunc()).tickFormat(_tickFormat_xFunc);
  _chart.timeline.yAxis().tickValues(_tickMarks_yFunc()).tickFormat(_tickFormat_yFunc);
  _chart.timeline.filter(_initialFilterValue);


  //********Selection display *************
  d3.select(playerParentId).append('label').append('select').classed(selectionDisplayClass, true);
  var timelineSelect = d3.select(playerParentId + ' .' + selectionDisplayClass);
  _domainList.forEach(function(d) {
    var option = timelineSelect.append('option');
    option.attr('value', d).text(d);
    if(d == _initialFilterValue)
      option.attr('selected', true);
  });
  timelineSelect.on('change', function() {
    var selectedValue = this.value;
    dc.events.trigger(function() {
      _chart.timeline.filterAll();
      _chart.timeline.filter(selectedValue);
      _chart.timeline.redrawGroup();
    })
  });
  _chart.timeline.renderlet(function() {
    timelineSelect[0][0].value = _chart.timeline.filters()[0];
  });

  //***********Player Control ************
  d3.select(playerParentId).append('div').classed(playerControlClass, true);
  _chart.playerControl = d3.select(playerParentId + ' .' + playerControlClass);
  _chart.playerControl.attr('aria-hidden', true);
  _chart.playerControl.append('h2').classed('hide-visually', true).text('Timeline Controls');
  _chart.playerControl.append('i').classed('fa fa-step-backward prev', true);
  _chart.playerControl.append('i').classed('fa fa-pause pause', true);
  _chart.playerControl.append('i').classed('fa fa-play play', true);
  _chart.playerControl.append('i').classed('fa fa-step-forward next', true);

  var advanceYearSelection = function() {
          var currentYearPosition = _domainList.indexOf(_chart.timeline.filters()[0]);
          var nextYearPosition;
          if (currentYearPosition >= _domainList.length-1){
            nextYearPosition = 0;
          }else{
            nextYearPosition = currentYearPosition + 1
          }
          var nextYear = _domainList[nextYearPosition];
          dc.events.trigger(function(){
            _chart.timeline.filterAll();
            _chart.timeline.filter(nextYear);
            _chart.timeline.redrawGroup();
          });
      }

  var previousYearSelection = function() {
      var currentYearPosition = _domainList.indexOf(_chart.timeline.filters()[0]);
      var nextYearPosition;
      if (currentYearPosition <= 0){
        nextYearPosition = _domainList.length-1;
      } else{
        nextYearPosition = currentYearPosition - 1
      }
      var nextYear = _domainList[nextYearPosition];
      dc.events.trigger(function(){
        _chart.timeline.filterAll();
        _chart.timeline.filter(nextYear);
        _chart.timeline.redrawGroup();
      });
  }

  var pauseYearPlayer = function() {
      _yearPlayerState = 'paused';
      d3.select(playerParentId + ' .' + playerControlClass + ' .pause').classed('active', true);
      d3.select(playerParentId + ' .' + playerControlClass + ' .play').classed('active', false);

  }
  var playYearPlayer = function() {
      _yearPlayerState = 'playing';
      d3.select(playerParentId + ' .' + playerControlClass + ' .pause').classed('active', false);
      d3.select(playerParentId + ' .' + playerControlClass + ' .play').classed('active', true);
  }

  _yearPlayerState = 'paused'; // one of: ['paused', 'playing']
  _chart.timeline.onClick = function(d){
    var filter = _chart.timeline.keyAccessor()(d);
    dc.events.trigger(function(){
      pauseYearPlayer();
      _chart.timeline.filterAll();
      _chart.timeline.filter(filter);
      _chart.timeline.redrawGroup();
    });
  };

  var resizeTimer;
  d3.select(window).on('resize', function() {
      clearTimeout(resizeTimer);
      resizeTimer = setTimeout(resize, 166);
  });
  d3.select(playerParentId + ' .' + playerControlClass + ' .pause').on('click', pauseYearPlayer);
  d3.select(playerParentId + ' .' + playerControlClass + ' .play').on('click', playYearPlayer);
  d3.select(playerParentId + ' .' + playerControlClass + ' .next').on('click', advanceYearSelection);
  d3.select(playerParentId + ' .' + playerControlClass + ' .prev').on('click', previousYearSelection);

  var intervalTime = 850;
  // if(navigator.appVersion.indexOf("MSIE 10.")!=-1) intervalTime = 1250;
  // if(navigator.appVersion.indexOf("MSIE 9.")!=-1) intervalTime = 1500;
  // if(mobilecheck == true) intervalTime = 2000;

  window.setInterval(function() {if(_yearPlayerState==='playing') advanceYearSelection();}, intervalTime);

  return _chart;
};




module.exports = timelineComponent;