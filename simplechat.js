var express = require('express');
var app = express();
var server = require('http').Server(app);
var io = require('socket.io')(server);

server.listen(3000, function () {
    var host = server.address().address;
    var port = server.address().port;

    console.log('Simplechat running at http://%s:%s', host, port);
});

var oneWeek = 604800;
app.use(express.static(__dirname + '/public', { maxAge: oneWeek }));

app.get('/', function (req, res) {
    res.render('index.html');
});

app.get('*', function (req, res) {
    res.redirect('/');
});

Array.prototype.remove = function() {
    var what, a = arguments, L = a.length, ax;
    while (L && this.length) {
        what = a[--L];
        while ((ax = this.indexOf(what)) !== -1) {
            this.splice(ax, 1);
        }
    }
    return this;
};

var users = [];
var messages = [];

io.on('connection', function (socket) {
    var username = 'Guest' + Math.floor(Math.random() * (10000 - 1 + 1)) + 1;
    users.push(username);
    socket.emit('username', username);
    for(var i = 0 ; i < messages.length ; i++) {
        socket.emit('message', messages[i]);
    }
    io.emit('message', {
        from: 'System',
        content: username + ' has joined chat.'
    });
    messages.push({
        from: 'System',
        content: username + ' has joined chat.'
    });
    socket.emit('message', {
        from: 'System',
        content: 'Hello ' + username + ', welcome to Simple-Chat!'
    });


    socket.on('username', function (newUsername) {
        if(username == newUsername) {
            return;
        }
        users = users.remove(username);
        io.emit('message', {
            from: 'System',
            content: username + ' is now know as ' + newUsername + '.'
        });
        messages.push({
            from: 'System',
            content: username + ' is now know as ' + newUsername + '.'
        });
        username = newUsername;
        users.push(username);
    });

    socket.on('message', function (message) {
       io.emit('message', message);
        messages.push(message);
    });

    socket.on('disconnect', function () {
        io.emit('message', {
            from: 'System',
            content: username + ' has left chat.'
        });
        messages.push({
            from: 'System',
            content: username + ' has left chat.'
        });
    });
});
