//
//var countryJson = {
//   'Shanghai': Math.floor((Math.random() * 1500000) + 900000),
//    'Buenos Aires': Math.floor((Math.random() * 1000000) + 500000),
//    'Mumbai': Math.floor((Math.random() * 1200000) + 600000)
//};



var app = angular.module('vizApp',[]);
app.controller('dataCtrl',["$scope","$http","$timeout",function($scope,$http,$timeout){
    $scope.countryJson = [];
    var counter = 0;
    var svg,g,xAxisG,yAxisG,xScale,yScale,colorScale,xAxis,yAxis;


    $scope.content_update1= function() {
        $http.get('http://localhost:8888/').success(function (result) {
            console.log(result);
            $scope.countryJson = result;
            //result[0].population = Math.floor((Math.random() * 15000000) + 9000000);
            counter++;

            var outerWidth = 600;
            var outerHeight = 250;
            var margin = {left: 90, top: 30, right: 30, bottom: 30};
            var barPadding = 0.3;

            var xColumn = "name";
            var yColumn = "population";

            var innerWidth = outerWidth - margin.left - margin.right;
            var innerHeight = outerHeight - margin.top - margin.bottom;




            if(counter==1){

                svg = d3.select("body").append("svg")
                    .attr("class","chartBox")
                    .attr("width", outerWidth)
                    .attr("height", outerHeight);
                g = svg.append("g")
                    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");
                xAxisG = g.append("g")
                    .attr("class", "x axis")
                    .attr("transform", "translate(0," + innerHeight + ")");
                yAxisG = g.append("g")
                    .attr("class", "y axis");

                xScale = d3.scale.ordinal().rangeBands([0, innerWidth], barPadding);
                yScale = d3.scale.linear().range([innerHeight, 0]);
                colorScale = d3.scale.category10();

                xAxis = d3.svg.axis().scale(xScale).orient("bottom")
                    .outerTickSize(0);          // Turn off the marks at the end of the axis.
               yAxis = d3.svg.axis().scale(yScale).orient("left")
                    .ticks(5)                   // Use approximately 5 ticks marks.
                    .tickFormat(d3.format("s")) // Use intelligent abbreviations, e.g. 5M for 5 Million
                    .outerTickSize(0);          // Turn off the marks at the end of the axis.
            }



            function render(data) {
                console.log(xScale);


                xScale.domain(data.map(function (d) {
                    return d[xColumn];
                }));
                yScale.domain([0, d3.max(data, function (d) {
                    return d[yColumn];
                })]);

                xAxisG.call(xAxis);
                yAxisG.call(yAxis);

                var bars = g.selectAll("rect").data(data);
                bars.enter().append("rect")
                    .attr("width", xScale.rangeBand())
                    .attr("fill", function (d) {
                        return colorScale(d[xColumn])
                    });



                bars
                    .attr("x", function (d) {
                        return xScale(d[xColumn]);
                    })
                    .attr("y", function (d) {
                        return yScale(d[yColumn]);
                    })
                    .attr("height", function (d) {
                        return innerHeight - yScale(d[yColumn]);
                    })


                bars.exit().remove();
            }

            function type(d) {
                d.population = +d.population;
                return d;
            }



            render($scope.countryJson
                //$scope.$apply(function(){return $scope.countryJson})
                //$timeout(function(){
                //    return $scope.countryJson;
                //},1000)
            );

        });
    };

    $scope.content_update1();
    setInterval($scope.content_update1,3000);


}]);



//var countryJson = [
//    {
//        'name': 'Shanghai',
//        'population': 22315474
//    },
//    {
//        'name': 'Buenos Aires',
//        'population': 13076300
//    },
//    {
//        'name': 'Mumbai',
//        'population': 12691836
//    }
//];




//d3.csv("geonames_cities_top3.csv", type, render);