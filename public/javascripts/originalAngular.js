
var app = angular.module("chatroom",['ngRoute']);

//app.config(function($routeProvider){
//    $routeProvider
//        .when('/',
//        {
//            templateUrl: '../partials/chatPartial.html',
//            controller: ''
//        })
//        .when('/chatdashboard',
//        {
//            templateUrl: '../partials/dashboardPartial.html',
//            controller: 'dataCtrl'
//        })
//        .otherwise(
//        {
//            templateUrl: '../partials/chatPartial.html',
//            controller: ''
//        })
//});

app.factory('socket', function ($rootScope) {
    var socket = io.connect();
    return {
        on: function (eventName, callback) {
            socket.on(eventName, function () {
                var args = arguments;
                $rootScope.$apply(function () {
                    callback.apply(socket, args);
                });
            });
        },
        emit: function (eventName, data, callback) {
            socket.emit(eventName, data, function () {
                var args = arguments;
                $rootScope.$apply(function () {
                    if (callback) {
                        callback.apply(socket, args);
                    }
                });
            })
        }
    };
});

app.controller("roomCtrl",['$scope','$http','socket',function($scope,$http,socket){
    $scope.existingUsers = [];

    socket.on('usernames',function(userlist){
        //alert("hi");
        $scope.existingUsers = userlist;
    });
    //$scope.existingUsers = dataFactory.userList;

}]);


app.controller('dataCtrl',["$scope","$http","$timeout",'socket',function($scope,$http,$timeout,socket){

    $scope.userBase = [];
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

    socket.on('justNames',function(userlist){
        //$scope.userBase = [];

        ////$scope.userBase = userlist;
        //for(i=0;i<userlist.length;i++){
        //    $scope.userBase.push({
        //        name: userlist[i]
        //    });
        //}
        //console.log($scope.userBase);
        $scope.userBase = userlist;
        console.log($scope.userBase);
    });

    socket.on("chat message",function(userchatCounter){
        counter++;

        for(i=0;i<$scope.userBase.length;i++){
            if($scope.userBase[i].name == userchatCounter.id)
            {
                $scope.userBase[i].stats = userchatCounter.stats;
            }
        }

        console.log($scope.userBase);


        //var outerSvgWidth = 1400;

        var outerWidth = 600;
        var outerHeight = 350;
        var margin = {left: 90, top: 30, right: 30, bottom: 30};
        var barPadding = 0.3;

        var xColumn = "name";
        var yColumn = "stats";
        //var textColumn = "chats";

        var innerWidth = outerWidth - margin.left - margin.right;
        var innerHeight = outerHeight - margin.top - margin.bottom;

        //if(counter>2){
        //    //$scope.tweets.shift();
        //    outerWidth = counter*50;
        //    //alert(outerWidth);
        //    //alert("hi");
        //}



        if(counter==1){

        svg = d3.select(".chartBox").append("svg")
            .attr("width", outerWidth)
            .attr("height", outerHeight);
        g = svg.append("g")
            .attr("transform", "translate(" + margin.left + "," + margin.top + ")");
        xAxisG = g.append("g")
            .attr("class", "x axis")
            .attr("transform", "translate(0," + innerHeight + ")");
        yAxisG = g.append("g")
            .attr("class", "y axis");

        svg.attr("width", outerWidth);



        xScale = d3.scale.ordinal().rangeBands([0, innerWidth], barPadding);
        yScale = d3.scale.linear().range([innerHeight, 0]);
        colorScale = d3.scale.category10();

        xAxis = d3.svg.axis().scale(xScale).orient("bottom")
            .outerTickSize(0);          // Turn off the marks at the end of the axis.
        yAxis = d3.svg.axis().scale(yScale).orient("left")
            .ticks(5)                   // Use approximately 5 ticks marks.
            //.tickFormat(d3.format("s")) // Use intelligent abbreviations, e.g. 5M for 5 Million
            .outerTickSize(0);          // Turn off the marks at the end of the axis.
        }




        function render(data) {
            //console.log(xScale);

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
                .attr("width", xScale.rangeBand())
                .attr("height", function (d) {
                    return innerHeight - yScale(d[yColumn]);
                });


            bars.exit().remove();

            //var bars = g.selectAll("rect").data(data);
            //bars.enter().append("rect")
            //    .attr("y",innerHeight/4)
            //    .attr("height",innerHeight/2 );
            //
            //bars
            //    .attr("fill", function (d) {
            //        return colorScale(d[xColumn])
            //    })
            //    .attr("x", function (d) {
            //        return xScale(d[xColumn]);
            //    })
            //    .attr("width", xScale.rangeBand())
            //
            //    .on('mouseover', function(d) {
            //
            //        tooltip.transition()
            //            .style('opacity', .9);
            //
            //        tooltip.html(d[textColumn])
            //            .style('left', (d3.event.pageX - 35) + 'px')
            //            .style('top',  (d3.event.pageY - 30) + 'px');
            //
            //
            //        tempColor = this.style.fill;
            //        d3.select(this)
            //            //.style('color','white')
            //            .style('opacity', .5)
            //            .style('fill', 'black')
            //    })
            //
            //    .on('mouseout', function(d) {
            //        d3.select(this)
            //            .style('opacity', 1)
            //            .style('fill', tempColor)
            //    });
            //
            //var textbox = bars.append("text").data(data);
            //textbox
            //    .attr("x", function (d) {
            //        return xScale(d[xColumn]);
            //    })
            //    .attr("y",innerHeight/4)
            //    .attr("text",function(d){
            //        return d[textColumn];
            //    })
            //    .attr("text-anchor","middle");
            //
            //
            //bars.exit().remove();
        }

        //function type(d) {
        //    d.population = +d.population;
        //    return d;
        //}


        render($scope.userBase);

    });

}]);