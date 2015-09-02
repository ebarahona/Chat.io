
var socket = io();

var app = angular.module('vizApp',[]);
app.controller('dataCtrl',["$scope","$http","$timeout",function($scope,$http,$timeout){
    $scope.tweets = [];
    var counter = 0;
    var outersvg,svg,g,xAxisG,yAxisG,xScale,yScale,colorScale,xAxis,yAxis;
    var tweetcount = 0;
    socket.on("tweets",function(tweet){
        counter++;
        tweetcount++;
        var outerWidth = 1400;
        $scope.tweets.push(tweet);
        //if(tweetcount>15){
        //    $scope.tweets.shift();
        //    //outerWidth = 2000;
        //}

        var outerSvgWidth = 1400;

        var outerHeight = 800;
        var margin = {left: 90, top: 30, right: 30, bottom: 30};
        var barPadding = 0.4;

        var xColumn = "Tweet Length";
        //var yColumn = "Frequency";
        var textColumn = "Tweet";

        var innerWidth = outerWidth - margin.left - margin.right;
        var innerHeight = outerHeight - margin.top - margin.bottom;




        if(counter==1){

            outersvg = d3.select("body").append("svg")
                .attr("class","chartBox")
                .attr("width", outerSvgWidth)
                .attr("height", outerHeight);

            svg = outersvg.append("svg")
                .attr("width", outerWidth)
                .attr("height", outerHeight);
            g = svg.append("g")
                .attr("transform", "translate(" + margin.left + "," + margin.top + ")");
            xAxisG = g.append("g")
                .attr("class", "x axis")
                .attr("transform", "translate(0," + innerHeight + ")");
            //yAxisG = g.append("g")
            //    .attr("class", "y axis");

            xScale = d3.scale.ordinal().rangeBands([0, innerWidth], barPadding);
            //yScale = d3.scale.linear().range([innerHeight, 0]);
            colorScale = d3.scale.category10();

            xAxis = d3.svg.axis().scale(xScale).orient("bottom")
                .outerTickSize(0);          // Turn off the marks at the end of the axis.
            //yAxis = d3.svg.axis().scale(yScale).orient("left")
            //    .ticks(5)                   // Use approximately 5 ticks marks.
            //    .tickFormat(d3.format("s")) // Use intelligent abbreviations, e.g. 5M for 5 Million
            //    .outerTickSize(0);          // Turn off the marks at the end of the axis.
        }



        function render(data) {
            console.log(xScale);


            xScale.domain(data.map(function (d) {
                return d[xColumn];
            }));
            //yScale.domain([0, d3.max(data, function (d) {
            //    return d[yColumn];
            //})]);

            xAxisG.call(xAxis);
            //yAxisG.call(yAxis);

            var bars = g.selectAll("rect").data(data);
            bars.enter().append("rect")
                .attr("width", xScale.rangeBand())
                .attr("fill", function (d) {
                    return colorScale(d[xColumn])
                })
                .attr("y",innerHeight/4)
                .attr("height",innerHeight/2 );

            bars
                .attr("x", function (d) {
                    return xScale(d[xColumn]);
                });

            var textbox = bars.append("text").data(data);
            textbox
                .attr("x", function (d) {
                    return xScale(d[xColumn]);
                })
                .attr("y",innerHeight/4)
                .attr("text",function(d){
                    return d[textColumn];
                })
                .attr("color","white")
                .attr("text-anchor","middle");


            bars.exit().remove();
        }

        //function type(d) {
        //    d.population = +d.population;
        //    return d;
        //}


        render($scope.tweets);

    });

}]);
