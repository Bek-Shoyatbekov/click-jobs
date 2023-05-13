const socketio = require('socketio');

export default server => {
    const io = socketio.listen(server, { ...options });

    io.on('connection', socket => {
        logger.info('Client Connected');
    });

    return io;
};