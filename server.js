const { createServer } = require('http');
const app = require('./src/app.js');
const db = require('./src/models/index.js');

db.check();
// db.syncDB();  DO NOT TOUCH

require('dotenv').config();
const server = createServer(app);


server.listen(process.env.PORT, () => {
    process.env.ENV == 'dev' && console.log('Server running at http://localhost:' + process.env.PORT);
})
