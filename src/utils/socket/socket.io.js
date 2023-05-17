const { Op } = require('sequelize');
const db = require('../../models/index');

const jwt = require('jsonwebtoken');

require('dotenv').config();

let activeSockets = {};

module.exports = class SocketManager {
    constructor(io) {
        this.io = io;
        this.adminIO = io.of('/admin');
        this.info = io.of('/info');
        this.setMiddlewares();
        this.adminEvents();
        this.socketEvents();
    }
    adminEvents() {
        this.adminIO.on('connection', socket => {
            console.log('Admin Socket Connected');
            socket.on('disconnect', socket => {
                console.log('Admin Socket Disconnected');
            })
        })
    }
    socketEvents() {
        this.io.on('connection', (socket) => {
            activeSockets[socket.user.id] = socket.id;
            socket.on("message", async ({ userId, message }, cb) => {
                if (!userId || !message) {
                    let missing = userId ? "Message is missing" : "User Id is missing"
                    return socket.emit('info', { message: missing });
                }
                const user = await db.user.findOne({ where: { id: userId } });
                if (!user) {
                    return socket.emit('info', { message: "User not found" });
                }
                const info = await user.createNotification({
                    text: ` ${socket.user.username} has messaged you`
                });
                const newMessage = await db.message.create({
                    from: socket.user.id,
                    to: userId,
                    text: message
                });
                if (activeSockets[userId]) {
                    this.io.to(activeSockets[userId]).emit("info", { message: `${socket.user.username} has messaged you` });
                    this.io.to(activeSockets[userId]).emit("message", { from: { name: `${socket.user.username}`, id: socket.user.id }, message: message });
                }
                await newMessage.save();
                await info.save();
            })
            socket.on('chats', async () => {
                const messages = await db.message.findAll({
                    where: {
                        [Op.or]: [
                            { from: socket.user.id },
                            { to: socket.user.id }
                        ]
                    },
                    // attributes: ['to', , "from", 'text', 'createdAt']
                });
                socket.emit('info', { message: "List of User", messages: messages });
            });
            socket.on('disconnect', socket => {
                console.log('Socket Disconnected');
            })
        })
    }

    setMiddlewares() {
        this.io.use(this.#isAuth);
    }

    async #isAuth(socket, next) {
        let token = socket.handshake.headers.auth;
        if (!token) {
            return next(new Error('No token provided'));
        }
        const decoded = jwt.verify(token, process.env.TOKEN_SECRET);
        let user = await db.user.findOne({ where: { id: decoded.userId } });
        if (!user) {
            return next(new Error('Invalid token'));
        }
        socket.user = user;
        next();
    }
}