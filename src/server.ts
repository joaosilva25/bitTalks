import express,{Request,Response} from 'express';
import path from 'path';
import dotenv from 'dotenv';
import { mongoConnect } from './database/mongo';
import appRoutes from './routes/appRoutes';
import mustache from 'mustache-express';
import session from 'express-session';
import http from 'http';
import {Server} from 'socket.io';


dotenv.config()

mongoConnect()

const app=express()
const server=http.createServer(app)
const io= new Server(server)


const sessionMiddleware=(session({
  secret: process.env.KEY_SESSION as string,
  resave: true,
  saveUninitialized: true,
  cookie: { 
    secure: false,
    maxAge: 1000 * 60 * 60 * 24 * 365 * 10
  }
}))

app.use(sessionMiddleware)

io.engine.use(sessionMiddleware);


let userConected:{user:any, perfilUser:String}[]=[];
let userName:String;
let perfil:String;

io.on('connection',(socket)=> {

  const session=(socket.request as any).session

  if(session && session.user.username) {
    userName = (socket.request as any).session.user.username
    perfil= (socket.request as any).session.user.perfil
    socket.emit('join-request',userName)

    let userExist=userConected.some(user=> user.user === userName);

    if(!userExist) {
      userConected.push({user:userName,perfilUser:perfil})
      console.log(`userConexãoAtiva:${userName}`)
    }
  }
  else {
    console.log("Usuário não conectado")
  }

  console.log(`ConectadosList:${JSON.stringify(userConected)}`)


  socket.emit('join-user',userConected)

  socket.broadcast.emit('join-user',userConected)

  socket.emit('join-chat',userName)
  socket.broadcast.emit('join-chat',userName)


  socket.on('disconnect',()=> {
    const seshOff=(socket.request as any).session.user.username

    let userIndex=userConected.findIndex(u=>u.user===seshOff)
    console.log(`Index do User removido:${userIndex}`)
    let offUser=(userConected.splice(userIndex,1))

    console.log(`Disconnected: ${JSON.stringify(offUser)}`)

    console.log(`AfterDisconnectList: ${JSON.stringify(userConected)}`)

    io.emit('disconnected',{
        exitedUser:offUser,
        listUpdate:userConected
    })

    

  })

  

  socket.on('send-message',(msg:string)=> {
      let obj= {
        user:(socket.request as any).session.user.username,
        message:msg
      }
    socket.emit('send-User',obj)
    socket.broadcast.emit('send-message',obj)

  })

});




app.set('view engine','mustache');
app.set('views',path.join(path.join(__dirname,'views')));
app.engine('mustache',mustache())


app.use(express.static(path.join(__dirname,'../public')));
app.use(express.urlencoded({extended:true}))
app.use('/node_modules', express.static(__dirname + '/node_modules'));


app.use(appRoutes)


app.use((req:Request,res:Response)=> {
    res.status(404)

    res.json({message:"Endpoint not found"})
})

server.listen(process.env.PORT)

