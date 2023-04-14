const db = require('../models/index');

const updateUserInputValidator = require('../utils/inputValidators/admin/updateUser');

const { Op } = require('sequelize');

const User = db.user;
const Req = db.req;
const Job = db.job;

module.exports = class adminController {
    static async getAllUsers(req, res, next) {
        try {
            const admin = await User.findOne({ where: { email: req.user.email, role: 'superadmin' } });
            if (!admin) {
                return res.status(401).send({ message: "you are not admin" });
            }
            const users = await User.findAll({
                where: {
                    role: {
                        [Op.ne]: 'banned'
                    }
                },
                include: [
                    {
                        model: Req, Job,
                    }
                ]
            });
            if (!users || users.length == 0) {
                return res.status(404).send({ message: "no users" });
            }
            return res.status(200).send(users);
        } catch (err) {
            return next(err);
        }
    }

    static async updateUserById(req, res, next) {
        try {
            if (!req.params.id || String(req.params.id).length == 0) {
                return res.status(400).send({ message: "id is required" });
            }
            const { error } = updateUserInputValidator(req.body);
            if (error) {
                return res.status(400).send({ message: `Inputs not valid \n ${error}` });
            }
            const admin = await User.findOne({ where: { email: req.user.email, role: 'superadmin' } });
            if (!admin) {
                return res.status(401).send({ message: "you are not admin" });
            }
            const user = await User.findOne({ where: { id: req.params.id } });
            if (!user) {
                return res.status(404).send({ message: "User not found" });
            }
            user.set({
                isVerified: req.body.isVerified,
                allowToPost: req.body.allowToPost,
                banned: req.body.banned
            });
            await user.save();
            return res.status(200).send({ message: "User updated" });
        } catch (err) {
            return next(err);
        }
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
        try {


        } catch (err) {

        }
    }
    
    static async getRequestByUserId(req, res, next) {

    }


}