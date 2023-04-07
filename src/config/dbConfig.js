require('dotenv').config();
const { env } = process;
module.exports = {
    HOST: env.DB_HOST,
    USER: env.DB_USER,
    PASSWORD: env.DB_PASS,
    DB: env.DB_DB,
    dialect: env.DB_DIALECT,
    pool: {
        max: 5,
        min: 0,
        acquire: 30000,
        idle: 10000
    }
};