const { createServer } = require('http');
const app = require('./src/app.js');
const db = require('./src/models/index.js');


db.check();
// db.syncDB();  // DO NOT TOUCH

const notFound = require('./src/utils/func/pageNotFound');

const ErrorHandler = require('./src/utils/func/errorHandler');


app.use('*', notFound);

app.use(ErrorHandler);



require('dotenv').config();

const server = createServer(app);


server.listen(process.env.PORT, () => {
    process.env.ENV == 'dev' && console.log('Server running at ' + process.env.BASE_URL);
})
