const path = require('path');
const express = require('express');
const http = require('https');
const WebSocket = require('ws');
const app = express();


var fs = require('fs');
var options = {
    key: fs.readFileSync( './ssl/cataldiserver_hopto_org_key.txt'),
    cert: fs.readFileSync('./ssl/cataldiserver.hopto.org.crt'),
    ca: fs.readFileSync('./ssl/cataldiserver.hopto.org.ca-bundle')
};

const httpServer = http.createServer(options,app);

const PORT = process.env.PORT || 5000;

const wsServer = new WebSocket.Server({ server: httpServer }, () => console.log(`WS server is listening at ws:https://cataldiserver.hopto.org:${WS_PORT}`));

// array of connected websocket clients
let connectedClients = [];

wsServer.on('connection', (ws, req) => {
    console.log('Connected ');
    // add new connected client
    connectedClients.push(ws);
    // listen for messages from the streamer, the clients will not send anything so we don't need to filter
    ws.on('message', data => {
        // send the base64 encoded frame to each connected ws
        connectedClients.forEach((ws, i) => {
            if (ws.readyState === ws.OPEN) { // check if it is still connected
                ws.send(data); // send
            } else { // if it's not connected remove from the array of connected ws
                connectedClients.splice(i, 1);
            }
        });
    });
});

var mysql = require('mysql');

/*var con = mysql.createConnection({
  host: "linc050.arubabusiness.it",
  user: "ij0a08l1_test",
  password: "EYM%Y?%#qa)$",
  database: "ij0a08l1_wp"
});

app.post('/startvideo', (req, res) => {
    var id = req.body;
    con.connect(function(err) {
        if (err) throw err;
        var sql = "UPDATE wp_users_ads SET is_online=1 WHERE id = 2372";
        con.query(sql, function (err, res) {
          if (err) throw err;
          console.log(res.affectedRows + " record(s) updated");
        });
      });
})
app.post('/stopvideo', (req, res) => {
    var id = req.body;
    con.connect(function(err) {
        if (err) throw err;
        var sql = "UPDATE wp_users_ads SET is_online=0 WHERE id =2372";
        con.query(sql, function (err, res) {
          if (err) throw err;
          console.log(res.affectedRows + " record(s) updated");
        });
      });
})*/

// HTTP stuff
app.get('/client', (req, res) => res.sendFile(path.resolve(__dirname, './client.html')));
app.get('/streamer', (req, res) => res.sendFile(path.resolve(__dirname, './streamer.html')));
app.get('/', (req, res) => {
    res.send(`
        <a href="streamer">Streamer</a><br>
        <a href="client">Client</a>
    `);
});
httpServer.listen(PORT, () => console.log(`HTTP server listening at https://cataldiserver.hopto.org:${PORT}`));
