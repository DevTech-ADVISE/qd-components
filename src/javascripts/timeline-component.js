var dcOrig = require('dc');
var sizeBoxify = require('./size-boxify.js');
var dc = sizeBoxify(dcOrig);
var formatters = require('qd-formatters')(d3);

var timelineComponent = function(playerControlId, timelineId, dimension, group, xLabel, yLabel, options) {
	var _chart = {playerControl: {}, timeline: {}};
  var _domainListFunc = function(g) {
   return g.top(Infinity).map(function(d){return d.key;}).sort();};
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
  _chart.timeline.filter(_domainListFunc(group)[_domainListFunc(group).length-2]);

  //player control section
  _chart.playerControl = d3.select(playerControlId);
  _chart.playerControl.attr('aria-hidden', true);
  _chart.playerControl.append('h2').classed('hide-visually', true).text('Timeline Controls');
  _chart.playerControl.append('i').classed('fa fa-step-backward prev', true);
  _chart.playerControl.append('i').classed('fa fa-pause pause', true);
  _chart.playerControl.append('i').classed('fa fa-play play', true);
  _chart.playerControl.append('i').classed('fa fa-step-forward next', true);

  var advanceYearSelection = function() {
          var currentYearPosition = yearList.indexOf(_chart.timeline.filters()[0]);
          var nextYearPosition;
          if (currentYearPosition >= yearList.length-1){
            nextYearPosition = 0;
          }else{
            nextYearPosition = currentYearPosition + 1
          }
          var nextYear = yearList[nextYearPosition];
          dc.events.trigger(function(){
            _chart.timeline.filterAll();
            _chart.timeline.filter(nextYear);
            _chart.timeline.redrawGroup();
          });
      }

  var previousYearSelection = function() {
      var currentYearPosition = yearList.indexOf(_chart.timeline.filters()[0]);
      var nextYearPosition;
      if (currentYearPosition <= 0){
        nextYearPosition = yearList.length-1;
      } else{
        nextYearPosition = currentYearPosition - 1
      }
      var nextYear = yearList[nextYearPosition];
      dc.events.trigger(function(){
        _chart.timeline.filterAll();
        _chart.timeline.filter(nextYear);
        _chart.timeline.redrawGroup();
      });
  }

  var pauseYearPlayer = function() {
      yearPlayerState = 'paused';
      d3.select(playerControlId + ' .pause').classed('active', true);
      d3.select(playerControlId + ' .play').classed('active', false);

  }
  var playYearPlayer = function() {
      yearPlayerState = 'playing';
      d3.select(playerControlId + ' .pause').classed('active', false);
      d3.select(playerControlId + ' .play').classed('active', true);
  }

  yearPlayerState = 'paused'; // one of: ['paused', 'playing']

  var resizeTimer;
  d3.select(window).on('resize', function() {
      clearTimeout(resizeTimer);
      resizeTimer = setTimeout(resize, 166);
  });
  d3.select(playerControlId + ' .pause').on('click', pauseYearPlayer);
  d3.select(playerControlId + ' .play').on('click', playYearPlayer);
  d3.select(playerControlId + ' .next').on('click', advanceYearSelection);
  d3.select(playerControlId + ' .prev').on('click', previousYearSelection);

  var intervalTime = 850;
  // if(navigator.appVersion.indexOf("MSIE 10.")!=-1) intervalTime = 1250;
  // if(navigator.appVersion.indexOf("MSIE 9.")!=-1) intervalTime = 1500;
  // if(mobilecheck == true) intervalTime = 2000;

  window.setInterval(function() {if(yearPlayerState==='playing') advanceYearSelection();}, intervalTime);




  return _chart;
};




module.exports = timelineComponent;