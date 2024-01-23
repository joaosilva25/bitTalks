"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const path_1 = __importDefault(require("path"));
const dotenv_1 = __importDefault(require("dotenv"));
const mongo_1 = require("./database/mongo");
const appRoutes_1 = __importDefault(require("./routes/appRoutes"));
const mustache_express_1 = __importDefault(require("mustache-express"));
const express_session_1 = __importDefault(require("express-session"));
const http_1 = __importDefault(require("http"));
const socket_io_1 = require("socket.io");
dotenv_1.default.config();
(0, mongo_1.mongoConnect)();
const app = (0, express_1.default)();
const server = http_1.default.createServer(app);
const io = new socket_io_1.Server(server);
const sessionMiddleware = ((0, express_session_1.default)({
    secret: process.env.KEY_SESSION,
    resave: true,
    saveUninitialized: true,
    cookie: {
        secure: false,
        maxAge: 1000 * 60 * 60 * 24 * 365 * 10
    }
}));
app.use(sessionMiddleware);
io.engine.use(sessionMiddleware);
let userConected = [];
let userName;
let perfil;
io.on('connection', (socket) => {
    const session = socket.request.session;
    if (session && session.user.username) {
        userName = socket.request.session.user.username;
        perfil = socket.request.session.user.perfil;
        socket.emit('join-request', userName);
        let userExist = userConected.some(user => user.user === userName);
        if (!userExist) {
            userConected.push({ user: userName, perfilUser: perfil });
            console.log(`userConexãoAtiva:${userName}`);
        }
    }
    else {
        console.log("Usuário não conectado");
    }
    console.log(`ConectadosList:${JSON.stringify(userConected)}`);
    socket.emit('join-user', userConected);
    socket.broadcast.emit('join-user', userConected);
    socket.emit('join-chat', userName);
    socket.broadcast.emit('join-chat', userName);
    socket.on('disconnect', () => {
        const seshOff = socket.request.session.user.username;
        let userIndex = userConected.findIndex(u => u.user === seshOff);
        console.log(`Index do User removido:${userIndex}`);
        let offUser = (userConected.splice(userIndex, 1));
        console.log(`Disconnected: ${JSON.stringify(offUser)}`);
        console.log(`AfterDisconnectList: ${JSON.stringify(userConected)}`);
        io.emit('disconnected', {
            exitedUser: offUser,
            listUpdate: userConected
        });
    });
    socket.on('send-message', (msg) => {
        let obj = {
            user: socket.request.session.user.username,
            message: msg
        };
        socket.emit('send-User', obj);
        socket.broadcast.emit('send-message', obj);
    });
});
app.set('view engine', 'mustache');
app.set('views', path_1.default.join(path_1.default.join(__dirname, 'views')));
app.engine('mustache', (0, mustache_express_1.default)());
app.use(express_1.default.static(path_1.default.join(__dirname, '../public')));
app.use(express_1.default.urlencoded({ extended: true }));
app.use('/node_modules', express_1.default.static(__dirname + '/node_modules'));
app.use(appRoutes_1.default);
app.use((req, res) => {
    res.status(404);
    res.json({ message: "Endpoint not found" });
});
server.listen(process.env.PORT);
