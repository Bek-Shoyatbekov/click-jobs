const db = require('../models/index');

const User = db.user;
const Req = db.req;
const Job = db.job;

module.exports = class adminContoller {
    static async getAllUsers(req, res, next) {

    }
    static async getUserById(req, res, next) {

    }
    static async getUserByEmail(req, res, next) {

    }
    static async getUserByUsername(req, res, next) {

    }
    static async getAllRequests(req, res, next) {
        try {
            const admin = await User.findOne({ where: { email: req.user.email, role: 'superadmin' } });
            if (!admin) {
                return res.status(401).send({ message: "you are not admin" });
            }
            const requests = await Req.findAll();
           
            if (!requests) {
                return res.status(404).send({ message: "no requests" });
            }
            return res.status(200).send(requests);

        } catch (err) {
            return next(err);
        }
    }
    static async getRequestById(req, res, next) {

    }
    static async getRequestByUserId(req, res, next) {

    }


}