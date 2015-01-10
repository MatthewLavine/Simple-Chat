var express = require('express');
var app = express();
var server = require('http').Server(app);
var io = require('socket.io')(server);
var moment = require('moment');
var program = require('commander');
var oneWeek = 604800;
var messages = [];
var keepHistory = false;

program
    .version('0.0.1')
    .option('-H, --history', 'Keep track of all client messages for the session and send all new clients a complete history of messages.')
    .option('-p, --port <port>', 'Specify a port to listen on (Default: 8000).', parseInt)
    .parse(process.argv)
    .outputHelp();

if(program.history) {
    keepHistory = true;
}

server.listen(program.port || 8000, function () {
    var host = server.address().address;
    var port = server.address().port;

    console.log('Simple-Chat running at http://%s:%s', host, port);
});

app.use(express.static(__dirname + '/public', { maxAge: oneWeek }));

app.get('/', function (req, res) {
    res.render('index.html');
});

app.get('*', function (req, res) {
    res.redirect('/');
});

function systemMessage (socket, message) {
    socket.emit('message', {
        from: 'System',
        time: moment().format('h:mm:ss A'),
        content: message
    });
}

function systemBroadcast (message) {
    io.emit('message', {
        from: 'System',
        time: moment().format('h:mm:ss A'),
        content: message
    });
}

function logMessage (message) {
    if(keepHistory) {
        messages.push(message);
    }
}

function sendHistory (socket) {
    if(keepHistory) {
        for (var i = 0; i < messages.length; i++) {
            socket.emit('message', messages[i]);
        }
    }
}

io.on('connection', function (socket) {
    var username = 'Guest' + Math.floor(Math.random() * (10000 - 1 + 1)) + 1;
    socket.emit('username', username);

    sendHistory(socket);

    systemBroadcast(username + ' has joined chat.');
    systemMessage(socket, 'Hello ' + username + ', welcome to Simple-Chat!');

    socket.on('username', function (newUsername) {
        if (username == newUsername) {
            return;
        }
        systemBroadcast(username + ' is now known as ' + newUsername + '.');
        username = newUsername;
    });

    socket.on('message', function (message) {
        io.emit('message', message);
        logMessage(message);
    });

    socket.on('disconnect', function () {
        systemBroadcast(username + ' has left chat.');
    });
});
