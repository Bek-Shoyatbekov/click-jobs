const { createServer } = require('http');

const app = require('./src/app.js');

const db = require('./src/models/index.js');



db.check();
// db.syncDB(); // DO NOT TOUCH


const notFound = require('./src/utils/func/pageNotFound');

const ErrorHandler = require('./src/utils/func/errorHandler');

app.use('*', notFound);

app.use(ErrorHandler);

require('dotenv').config();

const server = createServer(app);

const { Server } = require('socket.io');

const IO = new Server(server);

const SocketManager = require('./src/utils/socket/socket.io');

const io = new SocketManager(IO);


server.listen(Number(process.env.PORT), () => {
    process.env.ENV == 'dev' && console.log('Server running on port ' + (parseInt(process.env.PORT)));
})



