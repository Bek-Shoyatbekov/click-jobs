const { createServer } = require('http');
const app = require('./src/app.js');
const db = require('./src/models/index.js');

const swaggerJsdoc = require("swagger-jsdoc"),
    swaggerUi = require("swagger-ui-express");

db.check();
// db.syncDB();  DO NOT TOUCH

const options = {
    definition: {
        openapi: "3.1.0",
        info: {
            title: "LogRocket Express API with Swagger",
            version: "0.1.0",
            description:
                "This is a simple CRUD API application made with Express and documented with Swagger",
            license: {
                name: "MIT",
                url: "https://spdx.org/licenses/MIT.html",
            },
            contact: {
                name: "LogRocket",
                url: "https://logrocket.com",
                email: "info@email.com",
            },
        },
        servers: [
            {
                url: "http://localhost:3000",
            },
        ],
    },
    apis: ["/*.js"],
};

const specs = swaggerJsdoc(options);

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(specs))

require('dotenv').config();
const server = createServer(app);


server.listen(process.env.PORT, () => {
    process.env.ENV == 'dev' && console.log('Server running at http://localhost:' + process.env.PORT);
})
