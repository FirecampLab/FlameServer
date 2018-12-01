'use strict';
let io;
const base64Img = require('base64-img');
const fs = require("fs");
const mime = require('mime');
const _= require('underscore')
module.exports = class Socket {

    constructor(http) {

        io = require('socket.io')(http)
    }

    /**
     * Initialize socket
     * @param http
     */
    init() {
        let data = {
            "binary_small": "Hi, I am server.",
            "binary_large": "Hi, I am server. It's a socket.io demo of real-time chat. Get multiple arguments and emit to others.Its provide multi user support. Also support group chat and private chat with users. Socket.io provides socket id for every socket.",
            "text_small": "Hi, I am server.",
            "text_large": "Hi, I am server. It's a socket.io demo of real-time chat. Get multiple arguments and emit to others.Its provide multi user support. Also support group chat and private chat with users. Socket.io provides socket id for every socket.",
            "json_small": {
                "Message": "Hi I am server",
                "Data": "Get small data.",
                "Work": "Realtime chat messaging.",
                "Getdata": "Many types of data you get."
            },
            "json_large": {
                "User": {
                    "Add_group": {
                        "Groupname": {
                            "javascript": {
                                "Message": "It's javascript group"
                            }, "Nodejs": {
                                "Message": "It's Nodejs group"
                            }, "Socket": {
                                "Message": "It's socket group"
                            }, "Remove": "Group"
                        }
                    }
                }
            }
        }

        // On socket client connection
        io.on('connection', (socket) => {

            /**
             * convert function for string to binary convert
             * @param input
             * @returns {string}
             */
            let convert = (input) => {
                let output = "";
                for (let i = 0; i < input.length; i++) {
                    output += input[i].charCodeAt(0).toString(2) + " ";
                }
                return output
            }
            /**
             * get data in particular time and interval
             * @param counter
             * @param msg
             * @returns {Namespace|*|Socket}
             */
            let interval = (counter,msg)=>{
                let count,int
                if(!counter){
                    count = 3
                    int = 5
                    socket.emit('message',
`
by default times = 3 and interval = 5 sec,
You can customize it with argument like

{ 
    "times":2,
    "interval":5 
}`
                    )
                }
               else{
                    count =counter.times
                    int = counter.interval
                    if(count>5||int >10){
                        return socket.emit('message',
`please enter correct arguments,
 maximum range of argument like
     
 { 
    "times":5, 
    "interval":10 
 }
`
                        )
                    }
                   else if(!count){
                        count = 3
                        socket.emit('message', "by default times = 3")
                    }
                    else if(!int){
                        int = 5
                        socket.emit('message', "by default interval = 5 sec")
                    }
                }


                int = int*1000
                let i = 0
                let data = setInterval(()=>{
                    if(i == count){
                        clearInterval(data)
                        i = 0
                    }else{
                        i++
                        if(_.isArray(msg)){
                            socket.emit('message',  ...msg)
                        }
                        else {
                            socket.emit('message',  msg)
                        }
                    }
                },int)
            }
            /**
             * functions for emitting data
             * @returns {Namespace|Socket|void}
             */
            //emit text data
            let text_small = (counter) => interval(counter,data.text_small)
            let text_large = (counter) => interval(counter,data.text_large)
            let text_multi = (counter) => interval(counter,[data.text_small, data.text_large, data.text_small])
            //emit json data
            let json_small = (counter) => interval(counter,data.json_small)
            let json_large = (counter) => interval(counter,data.json_large)
            let json_multi = (counter) => interval(counter,{small:data.json_small,large:data.json_large,Small:data.json_small})
            //emit binary data
            let binary_small = (counter) => interval(counter,convert(data.binary_small))
            let binary_large = (counter) => interval(counter,convert(data.binary_large))
            let binary_multi = (counter) => interval(counter,[convert(data.binary_small), convert(data.binary_large), convert(data.binary_small)])

            /**
             * server side listen
             */
            socket.on('get_text', text_small)
            socket.on('get_text_small', text_small)
            socket.on('get_text_large', text_large)
            socket.on('get_text_multi', text_multi)

            socket.on('get_json', json_small)
            socket.on('get_json_small', json_small)
            socket.on('get_json_large', json_large)
            socket.on('get_json_multi', json_multi)

            socket.on('get_binary', binary_small)
            socket.on('get_binary_small', binary_small)
            socket.on('get_binary_large', binary_large)
            socket.on('get_binary_multi', binary_multi)

        });
    }
}
