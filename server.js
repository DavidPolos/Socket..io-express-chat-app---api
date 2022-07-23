const express = require('express');
const app = express();
const cors = require('cors');
const http = require('http');
const server = http.createServer(app);
const { Server } = require("socket.io");
const io = new Server(server,{
	cors: {
		origin: 'http://localhost:3000'
	}
});
const knex = require('knex')({
  client: 'pg',
  connection: {
    host : '127.0.0.1',
    port : 5432,
    user : 'postgres',
    password : 'test',
    database : 'codepractice'
  }
});
app.use(express.json());


io.on('connection', socket => {
	socket.on('send-message',(message, room) =>{
		socket.to(room).emit('send-message',message) //send message to a room specified in front
		console.log(message)
	})
})

//knex.select('messages').from('rooms').where({name: 'room1'}).then(data => {
//	console.log(data)
//})

app.use(cors({
    origin: 'http://localhost:3000',
    credentials: true,
}))


app.post('/room/:id',(req,res) => {
	const {id} = req.params;
	const {message} = req.body;
	console.log(id)
	
	knex('messages').insert({messages: message, name: id}).then(console.log("done"))
	res.json("something")

})

app.get('/messages/:room', (req,res) => {
	const {room} = req.params;
	knex.select('messages').from('messages').where({name: room})
	.then(messages => res.json(messages))
})

server.listen(3001,() => {
	console.log('listening on 3001')
})