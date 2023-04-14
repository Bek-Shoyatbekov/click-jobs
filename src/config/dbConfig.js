require('dotenv').config();

const { env } = process;

module.exports = {
    HOST: process.env.POSTGRESQL_DB_HOST,
    USER: process.env.POSTGRESQL_DB_USER,
    PASSWORD: process.env.POSTGRESQL_DB_PASSWORD,
    PORT:5432,
    DB: process.env.POSTGRESQL_DB,
    dialect: "postgres",
    pool: {
        max: 5,
        min: 0,
        acquire: 30000,
        idle: 10000
    }
};