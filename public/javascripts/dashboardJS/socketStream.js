//$(function(){
//    $('#inner-content-div').slimScroll({
//        height: '250px'
//    });
//});


var socket = io();

var app = angular.module('vizApp',[]);
app.controller('dataCtrl',["$scope","$http","$timeout",function($scope,$http,$timeout){
    $scope.tweets = [];
    var counter = 0;
    var tempColor;
    var outersvg,svg,g,xAxisG,yAxisG,xScale,yScale,colorScale,xAxis,yAxis;
    var tooltip = d3.select('body').append('div')
        .attr("class","tooltip")
        .style('position', 'absolute')
        .style('padding', '0 10px')
        .style('background', 'white')
        .style('opacity', 0.7);
    var outerWidth = 200;
    //alert(outerWidth);
    socket.on("tweets",function(tweet){
        counter++;

        $scope.tweets.push(tweet);


        //var outerSvgWidth = 1400;

        var outerHeight = 800;
        var margin = {left: 90, top: 30, right: 30, bottom: 30};
        var barPadding = 0.4;

        var xColumn = "Count";
        //var yColumn = "population";
        var textColumn = "Tweet";

        var innerWidth = outerWidth - margin.left - margin.right;
        var innerHeight = outerHeight - margin.top - margin.bottom;

        if(counter>2){
            //$scope.tweets.shift();
            outerWidth = counter*50;
            //alert(outerWidth);
            //alert("hi");
        }



        if(counter==1){

            svg = d3.select(".chartBox").append("svg")
                .attr("width", outerWidth)
                .attr("height", outerHeight);
            g = svg.append("g")
                .attr("transform", "translate(" + margin.left + "," + margin.top + ")");
            xAxisG = g.append("g")
                .attr("class", "x axis")
                .attr("transform", "translate(0," + innerHeight + ")");


        }

        svg.attr("width", outerWidth);



        xScale = d3.scale.ordinal().rangeBands([0, innerWidth], barPadding);
        colorScale = d3.scale.category10();

        xAxis = d3.svg.axis().scale(xScale).orient("bottom")
            .outerTickSize(0);          // Turn off the marks at the end of the axis.


        function render(data) {
            console.log(xScale);


            xScale.domain(data.map(function (d) {
                return d[xColumn];
            }));

            xAxisG.call(xAxis);
            //yAxisG.call(yAxis);

            var bars = g.selectAll("rect").data(data);
            bars.enter().append("rect")
                .attr("y",innerHeight/4)
                .attr("height",innerHeight/2 );

            bars
                .attr("fill", function (d) {
                    return colorScale(d[xColumn])
                })
                .attr("x", function (d) {
                    return xScale(d[xColumn]);
                })
                .attr("width", xScale.rangeBand())

                .on('mouseover', function(d) {

                    tooltip.transition()
                        .style('opacity', .9);

                    tooltip.html(d[textColumn])
                        .style('left', (d3.event.pageX - 35) + 'px')
                        .style('top',  (d3.event.pageY - 30) + 'px');


                    tempColor = this.style.fill;
                    d3.select(this)
                        //.style('color','white')
                        .style('opacity', .5)
                        .style('fill', 'black')
                })

                .on('mouseout', function(d) {
                    d3.select(this)
                        .style('opacity', 1)
                        .style('fill', tempColor)
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
