const db = require('../models/index');

const uuid = require('uuid');

const User = db.user;


module.exports = class ContentController {
    static async create(req, res, next) {
        try {
        } catch (err) {
            next(err);
        }
    }
    static async findOneById(req, res, next) {

    }
    static async findMany(req, res, next) {

    }
    static async updateById(req, res, next) {

    }
    static async deleteOne(req, res, next) {

    }
}