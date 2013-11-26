jQuery.noConflict();

function getURLParameter (name) {
    return decodeURI (
        (RegExp(name + '=' + '(.+?)(&|$)').exec(location.search)||[,null])[1]
    );
}

jQuery(document).ready (function() {
	
	url = prompt("Where do you want to go ?");
	
	jQuery.getScript ('http://'+url+':1337/socket.io/socket.io.js', function(){
		var socket = io.connect('http://'+url+':1337');

		// on connection to server, ask for user's name with an anonymous callback
		socket.on('connect', function(){
			// call the server-side function 'adduser' and send one parameter (value of prompt)
			socket.emit('connect', prompt("You hear a voice behind the door \"Who's there ?!\""));
		});

		// listener, whenever the server emits 'updatechat', this updates the chat body
		socket.on('updatechat', function (username, data) {
			jQuery('#conversation').append('<b>'+username + ':</b> ' + data + '<br>');
		});

		// listener, whenever the server emits 'tavernmessage', this updates the chat body
		socket.on('tavernmessage', function (message) {
			jQuery('#conversation').append('<i>' + message + '</i><br>');
		});

		// listener, whenever the server emits 'updateusers', this updates the username list
		socket.on('updateusers', function(data) {
			jQuery('#users').empty();
			jQuery.each(data, function(key, value) {
				jQuery('#users').append('<div>' + key + '</div>');
			});
		});

		// on load of page
		jQuery(function(){
			
			jQuery('#data').focus();
			
			// when the client clicks SEND
			jQuery('#datasend').click( function() {
				var message = jQuery('#data').val();
				jQuery('#data').val('');
				jQuery('#data').focus();
				// tell server to execute 'sendchat' and send along one parameter
				socket.emit('sendchat', message);
			});

			// when the client hits ENTER on their keyboard
			jQuery('#data').keypress(function(e) {
				if(e.which == 13) {
					jQuery(this).blur();
					jQuery('#datasend').focus().click();
					jQuery('#data').focus();
				}
			});
		});
	});
});
