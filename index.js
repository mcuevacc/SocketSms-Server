var net = require('net');
var sockets = [];
var HOST = '0.0.0.0';
var PORT = 8080;

var server = net.createServer();
server.listen(PORT, HOST);
console.log('Server listening on ' + HOST +':'+ PORT);

server.on('connection', function(socket) {

	socket.name = socket.remoteAddress + ":" + socket.remotePort 
    sockets.push(socket);

    console.log('CONNECTED: ' + socket.remoteAddress +':'+ socket.remotePort);
    
    socket.on('data', function(data) {
        console.log('DATA ' + socket.remoteAddress + ': ' + data);

        obj = JSON.parse(data);
	    if(typeof(obj.number)!=='undefined' && typeof(obj.text)!=='undefined'){
	        sockets.forEach(function(socket, index, array){
	            socket.write(data);
	        });
	    }
    });

    socket.on('end', function() {
        console.log(socket.name + " left the broadcast.\n");
        sockets.splice(sockets.indexOf(socket), 1);
    });

    socket.on('error', function(error) {
        console.log('Socket got problems: ', error.message);
    });
});