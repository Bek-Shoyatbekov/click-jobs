const db = require('../models/index');

const uuid = require('uuid');

const createJobInputValidator = require('../utils/inputValidators/content/createJob');

const User = db.user;

const Job = db.job;

const { Op } = require('sequelize');


module.exports = class ContentController {
    static async createJob(req, res, next) {
        try {
            if (Object.keys(req.body).length == 0) {
                return res.status(400).send({ message: 'No inputs!' });
            }
            const applicant = await User.findOne({ where: { email: req.user.email, role: 'applicant', allowToPost: true } });
            if (!applicant) {
                return res.status(403).send({ message: 'You can not post job' });
            }
            const { error } = createJobInputValidator(req.body);
            if (error) {
                return res.status(400).send({ message: error });
            }
            console.log(req.body.tags)
            const job = await applicant.createJob({
                title: req.body.title,
                description: req.body.description,
                jobType: req.body.jobType.split(' '),
                salary: req.body.salary,
                tags: req.body.tags.split(' ')
            });
            await job.save();
            res.status(201).send({ message: 'Job created' });
        } catch (err) {
            next(err);
        }
    }

    static async getAllJob(req, res, next) {
        try {
            const userIsValid = await User.findOne({
                where:
                {
                    email: req.user.email,
                    role: {
                        [Op.ne]: 'banned'
                    }
                },
                include: {
                    model: Job,
                    attributes: ['title', 'description', 'id', 'salary', 'jobType']
                }
            })
            if (!userIsValid) {
                return res.status(403).send({ message: 'You can not get job' });
            }
            return res.status(200).send(userIsValid.jobs);
        } catch (err) {
            next(err);
        }
    }

    static async updateById(req, res, next) {
        try {
            const jobId = req.params.jobId;
            if (!jobId) return res.status(400).send({ message: 'Job id is missing' });
            const job = await Job.findOne({
                where:
                {
                    id: jobId,
                }
            })
            if (!job) return res.status(404).send({ message: 'Job not found' });
            const user = await User.findOne({ where: { id: job.userId } });
            if (!user) return res.status(404).send({ message: 'User not found' });
            if (req.user.email !== user.email) return res.status(403).send({ message: 'You can not edit job' });
            job.set({
                title: req.body.title || job.title,
                description: req.body.description || job.description,
                jobType: req.body.jobType || job.jobType,
                salary: req.body.salary || job.salary
            });
            req.body.tags && job.set('tags', req.body.tags.split(' '))
            await job.save();
            return res.status(200).send({ message: 'Job updated' });
        } catch (err) {
            next(err);
        }
    }
    static async findOneById(req, res, next) {
        try {
            const jobId = req.params.jobId;
            if (!jobId) return res.status(400).send({ message: 'Job id is missing' });
            const job = await Job.findOne({
                where:
                {
                    id: jobId,
                }
            })
            if (!job) return res.status(404).send({ message: 'Job not found' });
            return res.status(200).send(job);
        } catch (err) {
            next(err);
        }
    }

    static async deleteById(req, res, next) {
        try {
            if (!req.params.jobId) {
                return res.status(400).send({ message: 'Job id is missing' });
            }
            const isValidUser = await User.findOne({ where: { email: req.user.email } });
            if (!isValidUser) {
                return res.status(403).send({ message: 'You can not delete job' });
            }
            await Job.destroy({
                where:
                {
                    id: req.params.jobId, userId: isValidUser.id
                }
            });
            return res.status(200).send({ message: 'Job deleted' });
        } catch (err) {
            next(err);
        }

    }
}