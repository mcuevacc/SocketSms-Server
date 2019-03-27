var net = require('net');
var sockets = [];
var senders = [];
var HOST = '0.0.0.0';
var PORT = 1337;

var server = net.createServer();
server.listen(PORT, HOST);
console.log('Server listening on '+HOST+':'+PORT);

server.on('connection', function(socket) {

    console.log('CONNECTED: '+socket.remoteAddress +':'+ socket.remotePort+"\n");

    socket.name = socket.remoteAddress+":"+socket.remotePort; 
    sockets.push(socket);

    socket.on('data', function(data) {
        try {
            console.log('DATA '+socket.remoteAddress + ': ' + data);
            
            if(data=='Sender'){
                senders.push(socket);
                return;
            }else{
                if((data.toString()).substring(0,1)!='{')
                    return;
                
                if(senders.length!=0)
                    socket.write('Send');                
                else
                    socket.write('Error');
            }  
                        
            obj = JSON.parse(data);
    	    if(typeof(obj.number)!=='undefined' && typeof(obj.text)!=='undefined'){
    	        senders.forEach(function(socket, index, array){
    	            socket.write(data);
    	        });
    	    }
        } catch (error) {
            console.error(error);
        }
    });

    socket.on('end', function() {
        console.log(socket.name+" left the broadcast.\n");
        sockets.splice(sockets.indexOf(socket), 1);
        if(senders.indexOf(socket)!=-1)
            senders.splice(senders.indexOf(socket), 1);
    });

    socket.on('error', function(error) {
        console.log('Socket got problem: ', error.message);
    });
    /*
    socket.on('uncaughtException', function(err) {
      console.error('UncaughtException: ',err.stack);
      //server.exit();
    });
    */
});