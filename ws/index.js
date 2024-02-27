const WS_PORT = 8822;

const WebSocket = require('ws');

const wss = new WebSocket.Server({ port: WS_PORT });

// This object will hold the rooms and their members
const rooms = {};

wss.on('connection', function connection(ws) {
  console.log('A client connected');

  ws.on('message', function incoming(message) {
    console.log('received: %s', message);

    const data = JSON.parse(message);

    switch (data.type) {
      case 'joinRoom':
        // Add the user to the specified room
        if (!rooms[data.roomId]) {
          rooms[data.roomId] = new Set();
        }
        rooms[data.roomId].add(ws);
        break;

      case 'drawing':
        // Broadcast the drawing data to all clients in the room
        if (rooms[data.roomId]) {
          rooms[data.roomId].forEach(client => {
            if (client !== ws && client.readyState === WebSocket.OPEN) {
              client.send(JSON.stringify(data));
            }
          });
        }
        break;

      case 'leaveRoom':
        // Remove the user from the room
        if (rooms[data.roomId]) {
          rooms[data.roomId].delete(ws);
          if (rooms[data.roomId].size === 0) {
            delete rooms[data.roomId];
          }
        }
        break;
    }
  });

  ws.on('close', () => {
    console.log('A client disconnected');
    // Remove the client from all rooms it might have joined
    Object.keys(rooms).forEach(roomId => {
      if (rooms[roomId].has(ws)) {
        rooms[roomId].delete(ws);
        if (rooms[roomId].size === 0) {
          delete rooms[roomId];
        }
      }
    });
  });
});

console.log(`WebSocket server started on port ${WS_PORT}`);
