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

    static async getUserById(req, res, next) {
        try {
            const id = req.params.userId;
            if (!id) {
                return res.status(400).send({ message: "no user id" });
            }
            const admin = await User.findOne({ where: { email: req.user.email, role: 'superadmin' } });
            if (!admin) {
                return res.status(401).send({ message: "you are not admin" });
            }
            const user = await User.findOne({
                where: {
                    id: id
                },
                include:
                    [
                        {
                            model: Req, Job,
                        }
                    ]
            });
            if (!user) {
                return res.status(404).send({ message: "no user" });
            }
            return res.status(200).send(user);
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

    static async getAllContent(req, res, next) {
        try {
            const admin = await User.findOne({ where: { email: req.user.email, role: 'superadmin' } });
            if (!admin) {
                return res.status(401).send({ message: "you are not admin" });
            }
            const jobs = await Job.findAll({
                include: {
                    model: User,
                }
            })
            return res.status(200).send(jobs);
        } catch (err) {
            next(err);
        }
    }

    static async updateContentById(req, res, next) {
        try {
            const admin = await User.findOne({ where: { email: req.user.email, role: 'superadmin' } });
            if (!admin) {
                return res.status(401).send({ message: "you are not admin" });
            }
            const jobId = req.params.jobId;
            if (!jobId) return res.status(400).send({ message: 'Job id is missing' });
            const job = await Job.findOne({
                where:
                {
                    id: jobId,
                }
            })
            if (!job) return res.status(404).send({ message: 'Job not found' });
            job.set({
                title: req.body.title || job.title,
                description: req.body.description || job.description,
                jobType: req.body.jobType || job.jobType,
                salary: req.body.salary || job.salary,
                status: req.body.status || job.status
            });
            req.body.tags && job.set('tags', req.body.tags.split(' '))
            await job.save();
            return res.status(200).send({ message: 'Job updated' });
        } catch (err) {
            next(err);
        }
    }

    static async findOneJobById(req, res, next) {
        try {
            const jobId = req.params.jobId;
            if (!jobId) return res.status(400).send({ message: 'Job id is missing' });
            const admin = await User.findOne({ where: { email: req.user.email, role: 'superadmin' } });
            if (!admin) {
                return res.status(401).send({ message: "you are not admin" });
            }
            const job = await Job.findOne({
                where:
                {
                    id: jobId,
                },
                include: {
                    model: User,
                    attributes: ['username', 'email', 'id']
                }
            })
            if (!job) return res.status(404).send({ message: 'Job not found' });
            return res.status(200).send(job);
        } catch (err) {
            next(err);
        }
    }

    static async deleteUserById(req, res, next) {
        try {
            const userId = req.params.userId;
            if (!userId) return res.status(400).send({ message: 'User id is missing' });
            const admin = await User.findOne({ where: { email: req.user.email, role: 'superadmin' } });
            if (!admin) {
                return res.status(401).send({ message: "you are not admin" });
            }
            const user = await User.findOne({ where: { id: userId } });
            if (!user) return res.status(404).send({ message: 'User not found' });
            await user.destroy();
            return res.status(200).send({ message: 'User deleted' });
        } catch (err) {
            next(err);
        }
    }

}