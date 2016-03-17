(function() {
	'use strict';

	var app = angular.module('angularSimpleBar', []);

	app.controller('SimpleBarController', ['$scope', '$window', function($scope, $window) {

		var dataSetOne = [
			{name: 'A', value: 50},
			{name: 'B', value: 100},
			{name: 'C', value: 75},
			{name: 'D', value: 35},
			{name: 'E', value: 125}
		];

		$scope.barChartConfig = {
			canvasHeight: 400,
			graphData: dataSetOne,
			xDataMetric: 'name',
			yDataMetric: 'value'
		};
	}]);

	app.directive('simpleBarChart', function($window) {
		return {
			retrict: 'E',
			replace: true,
			template: '<div class="simpleBarChart"></div>',
			scope: {
				chartConfig: '='
			},
			link: function(scope, element, attrs) {
				var chart = barChart(),
					chartEl = d3.select(element[0]),
					win = angular.element($window);

				win.bind('resize', function() {
					var newBcr = element[0].getBoundingClientRect();
					chartEl.call(chart.resizeChart(newBcr.width, chart.canvasHeight()));
				});

				if(scope.chartConfig.canvasWidth) {
					chart = chart.canvasWidth(scope.chartConfig.canvasWidth);
				} else {
					chart = chart.canvasWidth(Math.floor(element[0].getBoundingClientRect().width));
				}

				chart.getConfigurableProperties().forEach(function(prop) {
					if(scope.chartConfig.hasOwnProperty(prop) && chart.hasOwnProperty(prop)) {
						chart = chart[prop].call(chart, scope.chartConfig[prop]);
					}
				});

				chart.initChart(element[0]);

				scope.$watch('chartConfig.graphData', function(nv, ov) {
					if(nv !== undefined && nv !== ov) {
						chartEl.datum(nv).call(chart);
					}
				});
			}
		};
	});
})();