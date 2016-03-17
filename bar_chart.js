var barChart = function bc() {

	/**
	 * non-configurable properties
	 */
	var chartInitialized = false,
		gBar,
		gXAxis,
		gYAxis,
		svg,
		xAxis,
		xScale,
		yAxis,
		yScale;

	/**
	 * configurable properties
	 */
	var canvasHeight = 400,
		canvasWidth = 400,
		colorScale = d3.scale.category20(),
		graphData = [],
		margins = {
			top: 10,
			right: 10,
			bottom: 25,
			left: 50
		},
		xDataMetric = 'name',
		xTickFormat = function(d) { return d; },
		yDataMetric = 'value',
		yTickFormat = function(d, i) { return d; };

	/**
	 * @function
	 * @description Primary drawing/rendering method
	 */
	function draw() {
		if(graphData !== undefined) {
			setScales();
			handleBars();
			callAxes();
		}
	}

	/**
	 * @function
	 * @description Set X/Y scales
	 */
	function setScales() {

		////////////////////////////////////////
		// x scale is ordinal
		////////////////////////////////////////
		xScale = d3.scale.ordinal()
			.domain(graphData.map(function(m) {
				return m[xDataMetric];
			}))
			.rangeRoundBands(
				[0, canvasWidth - margins.left - margins.right],
				0.1,
				0.1
			);

		xAxis = d3.svg.axis()
			.scale(xScale)
			.tickSize(3)
			.tickPadding(3)
			.orient('bottom');

		////////////////////////////////////////
		// y scale is linear
		////////////////////////////////////////
		yScale = d3.scale.linear()
			.domain([
				0,
				d3.max(graphData, function(d) { return d[yDataMetric]; })
			])
			.range([
				canvasHeight - margins.bottom,
				margins.top
			]);

		yAxis = d3.svg.axis()
			.scale(yScale)
			.tickSize(3)
			.tickPadding(3)
			.orient('left')
			.tickFormat(yTickFormat);
	}

	/**
	 * @function
	 * @description Draw/redraw bars
	 */
	function handleBars() {

		gBar.attr('transform', function() {
			var x = margins.left, y = 0;
			return 'translate(' + x + ',' + y + ')';
		});

		var rectSelection = gBar.selectAll('rect')
			.data(graphData);

		rectSelection.exit()
			.transition()
			.duration(500)
			.attr('width', 0)
			.remove();

		rectSelection.enter()
			.append('rect')
			.attr('rx', 5)
			.attr('ry', 5)
			.style('stroke', 'white')
			.style('stroke-width', 1)
			.on('mouseover', function() {
				d3.select(this).style('stroke', 'black');
			})
			.on('mouseout', function() {
				d3.select(this).style('stroke', 'white');
			});

		rectSelection.transition()
			.duration(500)
			.attr('x', function(d) {
				return xScale(d[xDataMetric]);
			})
			.attr('y', function(d) {
				return yScale(d[yDataMetric]);
			})
			.attr('width', function(d) {
				return xScale.rangeBand();
			})
			.attr('height', function(d) {
				return canvasHeight - yScale(d[yDataMetric]) - margins.bottom;
			})
			.style('fill', function(d, i) {
				return colorScale(i);
			});
 	}

 	/**
 	 * @function
 	 * @description Transition the x/y axes in case of margin changes
 	 * and call the respective axis functions
 	 */
	function callAxes() {
		gXAxis.transition()
			.duration(250)
			.attr('transform', function() {
				var x = margins.left, y = canvasHeight - margins.bottom;
				return 'translate(' + x + ',' + y + ')';
			})
			.call(xAxis);

		gYAxis.transition()
			.duration(250)
			.attr('transform', function() {
				var x = margins.left, y = 0;
				return 'translate(' + x + ',' + y + ')';
			})
			.call(yAxis);
	}

	/**
	 * The main exports function.  This function, along with property functions
	 * configured below, is the return value of this overall chart class
	 */
	function exports(_selection) {
		_selection.each(function(_data) {
			if(_data !== undefined) {
				graphData = _data;
			}
			draw();
		});
	}

	exports.canvasHeight = function(ch) {
		if(!arguments.length) { return canvasHeight; }
		if(!isNaN(ch)) {
			canvasHeight = ch;
		}
		return this;
	};

	exports.canvasWidth = function(cw) {
		if(!arguments.length) { return canvasWidth; }
		if(!isNaN(cw)) {
			canvasWidth = cw;
		}
		return this;
	};

	exports.colorScale = function(cs) {
		if(!arguments.length) { return colorScale; }
		colorScale = cs;
		return this;
	};

	exports.graphData = function(d) {
		if(!arguments.length) { return graphData; }
		graphData = d;
		return this;
	};

	exports.initChart = function(el) {
		if(!chartInitialized) {

			svg = d3.select(el).append('svg')
				.attr('width', canvasWidth)
				.attr('height', canvasHeight);

			gBar = svg.append('svg:g')
				.attr('transform', function() {
					var x = margins.left, y = 0;
					return 'translate(' + x + ',' + y + ')';
				});

			gXAxis = svg.append('svg:g')
				.attr('class', 'axis')
				.attr('transform', function() {
					var x = margins.left, y = canvasHeight - margins.bottom;
					return 'translate(' + x + ',' + y + ')';
				});

			gYAxis = svg.append('svg:g')
				.attr('class', 'axis')
				.attr('transform', function() {
					var x = margins.left, y = 0;
					return 'translate(' + x + ',' + y + ')';
				});

			chartInitialized = true;
		}

		draw();
	};

	exports.margins = function(marginsObj) {
		if(!arguments.length) { return margins; }
		for(var prop in marginsObj) { margins[prop] = marginsObj[prop]; }
		return this;
	};

	exports.resizeChart = function(w, h) {
		if(svg !== undefined) {
			canvasWidth = Math.floor(w);
			svg.attr('width', w);
		}

		return this;
	};

	exports.xDataMetric = function(xdm) {
		if(!arguments.length) { return xDataMetric; }
		xDataMetric = xdm;
		return this;
	};

	exports.xTickFormat = function(fn) {
		if(!arguments.length) { return xTickFormat; }
		xTickFormat = fn;
		return this;
	};

	exports.yDataMetric = function(ydm) {
		if(!arguments.length) { return yDataMetric; }
		yDataMetric = ydm;
		return this;
	};

	exports.yTickFormat = function(fn) {
		if(!arguments.length) { return yTickFormat; }
		yTickFormat = fn;
		return this;
	};

	exports.getConfigurableProperties = function() {
		return [
			'canvasHeight',
			'canvasWidth',
			'colorScale',
			'graphData',
			'margins', 
			'xDataMetric',
			'xTickFormat',
			'yDataMetric',
			'yTickFormat'
		];
	};

	return exports;
};