var user_id = null;

var app = angular.module("chatroom",["streams"]);



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

app.factory("dataFactory",['$http','socket',function($http,socket){
    var factory = {};

    //socket.on("init",function(data){
    //    console.log(data);
    //    factory.getUserlist = data;
    //
    //    //factory.getUserlist = function(){
    //    //  //$http.get('/userlist').success(function(response){
    //    //  //    return response;
    //    //  //})
    //    //};
    //});

    socket.on("usernames",function(data){
        factory.userList = data;
    });
    factory.presentUsers = [];
    factory.storeNewUsers = function(username){

    };
    factory.updateUserList = function(){

    };
    return factory;
}]);

app.controller("userInfoCtrl",['$scope','$http','dataFactory','socket',function(socket,$scope,$http,dataFactory){


    $scope.newUser = function(username){
        //dataFactory.storeNewUsers(username);
        socket.emit('new user',username);
        $('#form2').fadeIn();
        //user_id = $(".username").val();
        //socket.emit('username',$(".username").val());
        $scope.newcomer = null;
        $('#form_main').fadeOut();

        //dataFactory.presentUsers.push(username);
    };

}]);

app.controller("roomCtrl",['$scope','$http','dataFactory','socket',function(socket,$scope,$http,dataFactory){
    $scope.existingUsers = ['harmeet','parmeet'];
    $scope.existingUsers = dataFactory.userList;
    //$scope.init = function(){
    //    $scope.existingUsers = dataFactory.getUserlist;
    //};

    //socket.on("init",function(data){
    //    console.log(data);
    //    $scope.existingUsers = dataFactory.getUserlist(data);
    //});



  //  $scope.newUser = dataFactory.storeNewUsers(socket.name);
}]);


//$('#form1').click(function(e){
//    e.preventDefault();
//    $('#form2').fadeIn();
//    user_id = $(".username").val();
//    socket.emit('username',$(".username").val());
////        $("#username").val('');
//    $('#form_main').fadeOut();
//    return false;
//});
//
//
//
//$('#form2').submit(function(){
//    socket.emit('chat message', user_id+": "+$('.m').val());
//    $('.m').val('');
//    return false;
//});
//socket.on('chat message', function(msg){
//    $('#messages').append($('<li>').text(msg));
//    //$('#messages').animate({scrollTop: $('#messages').prop("scrollHeight")}, 300);
//});
//
//socket.on('entering person', function(name){
//    $('#messages').append(
//        "<hr><br><div class='entering'>" +
//            "<h4>" +
//                name +
//            "</h4>" +
//        "</div><br><hr>"
//    );
//});
//
//    socket.on('disconnect', function(){
//        console.log("gone",gone);
//        socket.emit('last', user_id+": "+"bye");
//    });