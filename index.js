const http = require("http");
const WebSocketServer = require('websocket').server
let connections = []

// create a raw http server (this will hep us create the TCP which will then pass to the websocket) 
const httpserver = http.createServer();

// pass the httpserver object to the WebSocketServer library to do all the job, this class wil override the req/res
const websocket = new WebSocketServer({"httpServer": httpserver});

httpserver.listen(8080, () => console.log("Listing on port 8080"));

websocket.on("request", request => {
    const connection = request.accept(null, request.origin);
    connection.on("message", message => {
        // someone just sent a message, tell everybody
        // using remotePort as an unique ID
        connections.forEach(
            con => con.send(
                `User${connection.socket.remotePort} says: ${message.utf8Data}`
                )
        );
    })
    connections.push(connection)
    // someone hust connected, tell everybody
    connections.forEach(
        con => con.send(
            `User${connection.socket.remotePort} just connected.`
            )
    );
})

// Client Code
// let ws = new WebSocket("ws://localhost:8080")
// ws.onmessage = message => console.log(`${message.data}`);
// ws.send("hey");
