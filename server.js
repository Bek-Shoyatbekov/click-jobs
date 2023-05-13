const { Server, createServer } = require('http');

const app = require('./src/app.js');

const db = require('./src/models/index.js');

const socketio = require('socket.io');


db.check();
// db.syncDB();  // DO NOT TOUCH

const notFound = require('./src/utils/func/pageNotFound');

const ErrorHandler = require('./src/utils/func/errorHandler');

app.use('*', notFound);

app.use(ErrorHandler);


require('dotenv').config();

const server = new Server(app);

socketio(server);



server.listen(Number(process.env.PORT), () => {
    process.env.ENV == 'dev' && console.log('Server running on port ' + (parseInt(process.env.PORT)));
})






