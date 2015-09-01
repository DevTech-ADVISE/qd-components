var dc = require('dc');

//This component will take a collection of dc charts as the input, 
//and output a 508 compliant version of the charts using the chart data.
module.exports = function(parent, chartGroup) {

	var _chart = dc.baseMixin({});
	var _hiddenClassName = 'hide-visually';

	//all of the charts to be translated to 508
	var _charts; 

	_chart._mandatoryAttributes(undefined);

	_chart.hiddenClassName = function(_) {
		if(!arguments.length) return _hiddenClassName;
		_hiddenClassName = _;
		return _chart;
	};

	_chart.charts = function(_) {
		if(!arguments.length) return _charts;
		_charts = _;
		return _chart;
	};

	_chart.refreshList = function() {
		_chart.root().html('');
		Object.keys(_charts).forEach(function(chartName) {
			_chart.root()
				.append("h2")
				.attr("tabindex", "0")
				.text(chartName);
			var dataList = _chart.root().append("ul").style("list-style-type", "none");
			var chartToHide = _charts[chartName].chart;
			var chartFormatter = _charts[chartName].formatter || function(k, v) {return k + " " + v;};

			//hide the chart from 508 reader
			chartToHide.root()
				.attr("aria-hidden", "true");

			//add the chart data to a list of data for 508 readers
			chartToHide.data().forEach(function(d) {

				//check for normal .data() values
				if(!d) {
					dataList.append("li").append("button")
						.text(chartFormatter("No Data", ""));
				}
				else if(d.key !== undefined && d.value != undefined) {
					var key = chartToHide.label()(d);
					var value = chartToHide.valueAccessor()(d);

					dataList.append("li").append("button")
						.on("click", function(){
							chartToHide.filter(d.key);
							dc.redrawAll();
						})
						.text(chartFormatter(key, value));
				}
				//check for .data() value from barchart
				else if(d.values !== undefined) {
					d.values.forEach(function(dNested){
						var dataObj = dNested.data;
						var key = chartToHide.label()(dataObj);
						var value;
						value = chartToHide.valueAccessor()(dataObj);

						dataList.append("li").append("button")
							.on("click", function(){
								chartToHide.filter(dataObj.key);
								dc.redrawAll();
							})
							.text(chartFormatter(key, value));
					});
					
				}
				//check for .data() value from treemap
				else if(d.depth !== undefined) {
					var dataObj = d;
					var key = dataObj.name;
					var value = dataObj.value;

					//add a level
					var newLevel = dataList.append("li");
					newLevel.append("h2").text("Top Level: " + dataObj.columnName)
					newLevel.append("h3").text(chartFormatter(key, value));
					var levelList = newLevel.append("ul").style("list-style-type", "none");
					//New structure for reader because of hierarchical data
					addDataNodesTreemap(dataObj, levelList);

				}
				//check for .data() value from sankey
				else if(d.links !== undefined) {
					var dataObj = d;
					var topLevelColumnName = dataObj.nodes[0].columnName;

					//only traverse from the top level down the tree
					dataObj.nodes.forEach(function(node) {
						if(node.columnName === topLevelColumnName) {
							var key = node.name;
							var value = node.value;

							//add a level
							var newLevel = dataList.append("li");
							newLevel.append("h2").text("Column: " + node.columnName);
							newLevel.append("h3").text(chartFormatter(key, value));
							var levelList = newLevel.append("ul").style("list-style-type", "none");
							addDataNodesSankey(node, levelList)
						}
					});
				}


			});

			function addDataNodesTreemap(dataObj, listSelector) {
				if(dataObj._children) {
					dataObj._children.forEach(function(childObj) {
						var key = childObj.name;
						var value = childObj.value;

						var newLevel = listSelector.append("li");
						newLevel.append("h2").text("Level: " + childObj.columnName);
						newLevel.append("h3").text(chartFormatter(key, value));
						
						if(childObj._children) {
							var levelList = newLevel.append("ul").style("list-style-type", "none");
							addDataNodesTreemap(childObj, levelList);
						}
					});
				}
				return;
			}

			function addDataNodesSankey(dataObj, listSelector) {
				dataObj.sourceLinks.forEach(function(linkToNextNode) {
					var targetNode = linkToNextNode.target;
					var key = targetNode.name;
					var value = targetNode.value;

					var newLevel = listSelector.append("li");
					newLevel.append("h2").text("Column: " + targetNode.columnName);
					newLevel.append("h3").text(chartFormatter(key, value));

					if(targetNode.sourceLinks.length > 0){
						var levelList = newLevel.append("ul").style("list-style-type", "none");
						addDataNodesSankey(targetNode, levelList);
					}
				});
			}
		
		});
	};



	_chart._doRender = function() {
		_chart.root().classed('audio-dash', true);
		_chart.root().classed(_hiddenClassName, true);

		_chart.refreshList();
	};

	_chart._doRedraw = function() {
		_chart.refreshList();
	};

	return _chart.anchor(parent, chartGroup);
};