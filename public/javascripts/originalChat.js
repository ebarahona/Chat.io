var socket = io.connect();



$('#form1').click(function(e){
    e.preventDefault();
    $('#form2').fadeIn();
    user_id = $(".username").val();
    socket.emit('new user',$(".username").val());
//        $("#username").val('');
    $('#form_main').fadeOut();
    return false;
});



$('#form2').submit(function(){
    socket.emit('chat message', $('.m').val());
    $('.m').val('');
    return false;
});
socket.on('chat message', function(msg){
    $('#messages').append(
        "<li class='entering'>" +
        "<strong>" +
        msg.id+ ':' +
        "</strong>" + " " + msg.message +
        "</li>" + "<br>"
    );
    //$('#messages').animate({scrollTop: $('#messages').prop("scrollHeight")}, 300);
});

socket.on('entering person', function(name){
    $('#messages').append(
        "<hr><br><div class='entering'>" +
        "<h4>" +
        name +
        "</h4>" +
        "</div><br><hr>"
    );
});

socket.on('leaving person', function(name){
    $('#messages').append(
        "<hr><br><div class='entering'>" +
        "<h4>" +
        name +
        "</h4>" +
        "</div><br><hr>"
    );
});

