var net = require('net');
var sockets = [];
var HOST = '0.0.0.0';
var PORT = 1337;

var server = net.createServer();
server.listen(PORT, HOST);

console.log('Server listening on '+HOST+':'+PORT);

server.on('connection', (socket)=>{

    console.log('CONNECTED: '+socket.remoteAddress+':'+socket.remotePort);

    socket.name = socket.remoteAddress+":"+socket.remotePort; 

    socket.on('data', (data)=>{
        try {
            console.log('DATA '+socket.remoteAddress+': '+data);
            
            if(data=='Sender'){                
                console.log("Name: "+socket.name);

                socket.setKeepAlive(true,10000);
                sockets.push(socket);
                return;
            }else{
                if((data.toString()).substring(0,1)!='{')
                    return;
                
                if(sockets.length!=0){
                    console.log('Existen "'+sockets.length+'" senders');
                    socket.write('Send');
                }else{
                    console.log("No hay senders");
                    socket.write('Error');
                }
            }

            obj = JSON.parse(data);
    	    if(typeof(obj.number)!=='undefined' && typeof(obj.text)!=='undefined'){
    	        sockets.forEach((socket, nderindex, array)=>{
                    console.log('Enviando peticion a sender :'+socket.name);
    	            socket.write(data);
    	        });
    	    }
        }catch(error){
            console.error(error);
        }
    });

    socket.on('end', ()=>{
        console.log(socket.name+" left the broadcast");
        if(sockets.indexOf(socket)!=-1)
            sockets.splice(sockets.indexOf(socket), 1);
    });

    socket.on('error', (error)=>{
        console.log('Socket got problem: ', error.message);
    });
});