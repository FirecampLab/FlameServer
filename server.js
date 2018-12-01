const app = require('express')();
const http = require('http').Server(app);

const Socket = require('./socket');
const socket = new Socket(http);
socket.init()

http.listen(4002, ()=>{
    console.log('listening on *:4002');
});

// Route for modifier
app.get('/', (req, res)=> {
    res.sendFile('modifier.html', {root: './public'});
});

