const { createServer } = require('http');
const app = require('./src/app.js');
const db = require('./src/models/index.js');



db.check();
// db.syncDB();  //npm DO NOT TOUCH

// Swagger Doc 

const swaggerJsdoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');

const options = {
    "definition": {
        "openapi": "3.0.2",
        // "swagger": "2.0",
        "info": {
            "title": "Click Jobs API",
            "version": "1.0",
            description: `It's for Click Jobs platform which is famous with its services`,
            license: {
                name: "MIT",
                url: "https://spdx.org/licenses/MIT.html",
            },
            contact: {
                name: "Bek",
                url: "https://t.me/Bek_Shoyatbekov",
                email: "shoyatbekov03032003@gmail.com",
            },
        },
        "servers": [
            {
                "url": `${process.env.BASE_URL}${process.env.PORT}`,
                description: 'Development server',
            }
        ],
        "paths": {
        }
    },
    apis: ['./src/routes/*.js'],
}


const specs = swaggerJsdoc(options);

app.use('/docs', swaggerUi.serve, swaggerUi.setup(specs, { explorer: true }));

const notFound = require('./src/utils/func/pageNotFound');

const ErrorHandler = require('./src/utils/func/errorHandler');


app.use('*', notFound);

app.use(ErrorHandler);





require('dotenv').config();
const server = createServer(app);


server.listen(process.env.PORT, () => {
    process.env.ENV == 'dev' && console.log('Server running at http://localhost:' + process.env.PORT);
})
