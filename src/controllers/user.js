const db = require('../models/index');

const bcrypt = require('bcryptjs');

const _ = require('lodash');

const io = require('../../server');

const { Op } = require('sequelize');

const signUpInputValidator = require('../utils/inputValidators/user/signup');

const generateAccessToken = require('../middlewares/auth/generateAccessToken');

const signInInputValidator = require('../utils/inputValidators/user/signin');

const updateInputValidator = require('../utils/inputValidators/user/update');

const emailInputValidator = require('../utils/inputValidators/user/email');

const sendEmail = require('../utils/email_service/send_email');

const reqInputValidator = require('../utils/inputValidators/user/req');

const deleteFile = require('../utils/func/delete_file');


const User = db.user;
const Code = db.code;
const Job = db.job;
const App = db.application;
const Saved = db.saved;


module.exports = class UserController {
    static async signup(req, res, next) {
        try {
            let body;
            const { error, value } = signUpInputValidator(req.body);
            if (error) {
                return res.status(400).send(`Inputs not valid: ${error.details[0].message}`)
            } else {
                body = value;
            }
            const exists = await User.findOne({
                where:
                {
                    email: req.body.email
                }
            })
            if (exists) {
                return res.status(400).send({ message: 'User already exists' });
            }

            const email = body.email;
            const code = Math.floor(Math.random() * 10000)
                .toString()
                .padStart(4, "0");
            let verifyCode = await Code.create({
                userEmail: email,
                code: code
            });
            req.session.user = body;
            await verifyCode.save();
            await sendEmail(email,
                'User verification from Click Jobs',
                `Click to verify your email`
                , `<h1>Email Confirmation</h1>
                <h2>Hello ${body.username}</h2>
                <p>Thank you for subscribing!</p>
                Your confirmation code is : ${code}
                </div>`);
            return res.status(200).send({ message: 'Email has been sent to your email\n Check email ' });
        } catch (err) {
            next(err);
        }
    };

    static async verifyUserEmail(req, res, next) {
        try {
            let body = req.session.user;
            const code = req.body.code;
            if (String(code).length != 4) {
                return res.status(400).send({ message: 'Invalid verification code' });
            }
            const verifyCode = await Code.findOne({ where: { code: code } });
            if (!verifyCode) {
                return res.status(400).send({ message: 'Invalid verification code' });
            }

            let token = generateAccessToken(body.email);
            let token1 = generateAccessToken(body.email);

            const hashedPassword = await bcrypt.hash(body.password, 10);
            const user = await User.create({
                username: body.username,
                email: body.email,
                password: hashedPassword,
                role: body.role,
                accessToken: token,
                refreshToken: token1
            });
            await user.save();
            await verifyCode.destroy();
            return res.status(200).send({ message: 'User has been verified', token: token });
        } catch (err) {
            next(err);
        }
    }

    static async sendResetCode(req, res, next) {
        try {
            if (!req.body.email) {
                return res.status(400).send(`Please enter your email`);
            }
            const { error } = emailInputValidator(req.body);
            if (error) {
                return res.status(400).send(`Inputs not valid: ${error.details[0].message}`)
            }
            const email = req.body.email;
            const code = Math.floor(Math.random() * 10000)
                .toString()
                .padStart(4, "0");
            let verifyCode = await Code.create({
                userEmail: email,
                code: code
            });
            await verifyCode.save();
            await sendEmail(email,
                'User verification from Click Jobs', `
                Verification code is ${code}
            `);
            return res.status(201).send({ message: 'Email has been sent' });
        } catch (err) {
            next(err);
        }
    }

    static async resetPassword(req, res, next) {
        try {
            if (!req.body.code || !req.body.password) {
                return res.status(400).send({ message: 'Input not provided' });
            }
            const code = await Code.findOne({ where: { code: req.body.code } });
            if (!code) {
                return res.status(400).send({ message: 'code is invalid' });
            }
            const user = await User.findOne({ where: { email: code.userEmail } });
            if (!user) {
                return res.status(400).send({ message: ' \n code doesn\'t belong User' });
            }
            await User.update({
                password: req.body.password
            }, {
                where: {
                    email: code.userEmail
                }
            });
            await code.destroy();
            return res.status(200).send({ message: "You password has been changed" });
        } catch (err) {
            next(err);
        }
    }

    static async signin(req, res, next) {
        try {
            if (req.body.constructor === Object && Object.keys(req.body).length === 0) {
                return res.status(400).send(`Inputs not valid: Input must have `)
            }
            const { error } = signInInputValidator(req.body);
            if (error || !req.body.email || !req.body.password) {
                return res.status(400).send(`Inputs not valid: ${error}`)
            }
            const user = await User.findOne({
                where:
                {
                    email: req.body.email,
                    role: {
                        [Op.ne]: 'banned'
                    }
                }
            });
            if (!user) {
                return res.status(401).send({ message: 'User not found' });
            }
            const passwordIsValid = await bcrypt.compare(req.body.password, user.password);
            if (!passwordIsValid) {
                return res.status(401).send({ message: 'Email or password  invalid' });
            } else {
                let msg = '';
                const token = generateAccessToken(user.email);
                const token1 = generateAccessToken(user.email);

                if (!user.isVerified) {
                    msg = 'Please verify your email';
                }
                user.accessToken = token;
                user.refreshToken = token1;
                await user.save();
                return res.status(200).send({
                    message: `Signed in \n` + msg,
                    token: token
                })
            }
        } catch (err) {
            next(err);
        }
    };

    static async logout(req, res, next) {
        try {
            if (!req.user) {
                return res.status(400).send({ message: 'User not registered!' });
            }
            const user = await User.findOne({ where: { email: req.user.email } });
            if (!user) {
                return res.status(400).send({ message: 'User not registered!' });
            }
            user.accessToken = '';
            await user.save();
            return res.status(200).send({ message: 'Logged out' });
        } catch (err) {
            next(err);
        }
    };

    static async getProfile(req, res, next) {
        try {
            const user = await User.findOne({
                where: {
                    email: req.user.email,
                    role: {
                        [Op.ne]: 'banned'
                    }
                }
            });
            if (!user || user.accessToken == "") {
                return res.status(400).send({ message: 'User not found!' });
            }
            return res.status(200).send(user);
        } catch (err) {
            next(err);
        }
    }

    static async uploadImage(req, res, next) {
        try {
            if (_.isEmpty(req.file)) {
                return res.status(400).send({ message: 'No file uploaded!' });
            }
            const file = req.file;
            if (!req.user.email) {
                return res.status(400).send({ message: 'User not registered!' });
            }
            const user = await User.findOne({ where: { email: req.user.email } });
            if (!user) {
                return res.status(400).send({ message: 'User not found!' });
            }
            if (user.image) {
                const result = deleteFile(user.image);
                if (result) {
                    console.log('old file has been deleted')
                } else {
                    console.log('Error during delete old file')
                }
            }
            user.set({
                image: file.path
            });
            await user.save();
            //send a response
            return res.status(200).send('Image saved successfully');
        } catch (err) {
            next(err);
        }
    }

    static async uploadResume(req, res, next) {
        try {
            if (_.isEmpty(req.file)) {
                return res.status(400).send({ message: 'No file uploaded!' });
            }
            const file = req.file;
            if (!req.user.email) {
                return res.status(400).send({ message: 'User not registered!' });
            }
            const user = await User.findOne({ where: { email: req.user.email } });
            if (!user) {
                return res.status(400).send({ message: 'User not found!' });
            }
            if (user.resume) {
                const result = deleteFile(user.resume);
                if (result) {
                    console.log('old file has been deleted')
                } else {
                    console.log('Error during delete old file')
                }
            }
            user.set({
                resume: file.path
            });
            await user.save();
            //send a response
            return res.status(200).send('Resume saved successfully');
        } catch (err) {
            next(err);
        }
    }

    static async updateProfile(req, res, next) { //   Only the owner can update profile . We can check weather user is valid or not through jwt token 
        try {
            if (_.isEmpty(req.body)) {
                return res.status(400).send({ message: 'Update profile failed!\nThere is nothing to be updated' });
            }
            if (!req.user.email) {
                return res.status(400).send({ message: 'User not registered!' });
            }
            const user = await User.findOne({ where: { email: req.user.email } });
            if (user.accessToken == '') {
                return res.status(400).send({ message: 'User not registered!' });
            }
            if (user.role != 'superadmin' && !user) {
                return res.status(400).send({ message: 'You are not Owner!' });
            }
            const { error } = updateInputValidator(req.body);
            if (error) {
                return res.status(400).send(`Inputs not valid: ${error}`)
            }
            const body = req.body;
            let hashedPassword;
            if (body.password) {
                hashedPassword = await bcrypt.hash(body.password, 10);
            }
            const result = await User.update(
                {
                    ...(body.username && { username: body.username }),
                    ...(body.email && { email: body.email }),
                    ...(body.phone && { phone: body.phone }),
                    ...(body.password && { password: hashedPassword }),
                    ...(body.bio && { bio: body.bio }),
                    ...(body.role && { role: body.role }),
                },
                {
                    where:
                    {
                        email: req.user.email
                    }
                });
            res.status(200).send({ message: `User has been updated` });
        } catch (err) {
            next(err);
        }
    }

    static async sendReq(req, res, next) {
        try {
            if (Object.keys(req.body).length == 0) {
                return res.status(400).send({ message: 'No inputs!' });
            }
            const { error } = reqInputValidator(req.body);
            if (error) {
                return res.status(400).send(`Inputs not valid: ${error}`)
            }
            const body = req.body;
            const admin = await User.findOne({ where: { role: 'superadmin' } });
            if (!admin) {
                return res.status(400).send({ message: 'No superadmin!' });
            }
            const user = await User.findOne({ where: { email: req.user.email } });
            const request = await user.createReq({
                subject: body.subject,
                text: body.text,
                tags: body.tags
            });
            await request.save();
            if (admin) {
                await sendEmail(admin.email, body.subject, body.text,
                    `<h1>User requested you</h1> <h5> ${body.text} </h5>
                    <button>  <a href="${process.env.BASE_URL}/admin/requests"</a> </button>
                `);
            }
            res.status(201).send({ message: `Request has been created` });
        } catch (err) {
            next(err);
        }
    }

    static async search(req, res, next) {
        try {
            const { tags, jobType, minSalary, maxSalary, keyword } = req.query;
            const options = {
                where: {},
                include: {
                    model: User
                }
            };
            if (tags) {
                options.where.tags = {
                    [Op.contains]: tags.split(',')
                };
            }
            if (jobType) {
                options.where.jobType = {
                    [Op.contains]: jobType.split(',')
                };
            }
            if (minSalary || maxSalary) {
                options.where.salary = {};
                if (minSalary) {
                    options.where.salary[Op.gte] = minSalary;
                }
                if (maxSalary) {
                    options.where.salary[Op.lte] = maxSalary;
                }
            }
            if (keyword) {
                options.where[Op.or] = [
                    {
                        description: {
                            [Op.like]: "%" + keyword + "%",
                        },
                    },
                    {
                        title: {
                            [Op.like]: "%" + keyword + "%",
                        },
                    },
                ];
            }

            const jobs = await Job.findAll(options);
            if (!jobs) {
                return res.status(404).send({ message: 'No jobs found' });
            }
            res.status(200).send({ message: 'Jobs found', jobs });
        } catch (err) {
            next(err);
        }
    }

    static async applyJob(req, res, next) {
        try {
            const { jobId } = req.params;
            if (!jobId) {
                return res.status(400).send({ message: 'Job id is required' });
            }
            const user = await User.findOne({ where: { email: req.user.email } });
            if (!user) {
                return res.status(400).send({ message: 'User not found' });
            }
            const job = await Job.findOne({ where: { id: jobId } });
            if (!job) {
                return res.status(404).send({ message: 'Job not found' });
            }
            await App.create({
                jobId: jobId,
                userId: user.id
            })
            return res.status(200).send({ message: `Applied successfully!` })
        } catch (err) {
            next(err);
        }
    }

    static async myApplications(req, res, next) {
        try {
            const user = await User.findOne(
                {
                    where: {
                        email: req.user.email
                    },
                    include: {
                        model: App
                    }
                });
            if (!user) {
                return res.status(400).send({ message: 'User not found' });
            }
            if (!user.applications) {
                return res.status(404).send({ message: 'No apps found' });
            }
            return res.status(200).send({ message: 'Apps found', apps: user.applications });
        } catch (err) {
            next(err);
        }
    }

    static async saveJob(req, res, next) {
        try {
            const { jobId } = req.params;
            if (!jobId) {
                return res.status(400).send({ message: 'Job id is required' });
            }
            const user = await User.findOne({ where: { email: req.user.email } });
            if (!user) {
                return res.status(400).send({ message: 'User not found' });
            }
            await user.createSaved({ jobId: jobId });
            return res.status(200).send({ message: 'Job saved' });
        } catch (err) {
            next(err);
        }
    }

    static async getSaved(req, res, next) {
        try {
            const user = await User.findOne({ where: { email: req.user.email } });
            if (!user) {
                return res.status(400).send({ message: 'User not found' });
            }
            const jobs = await Saved.findAll({
                where: { userId: user.id },
                include: {
                    model: Job
                }
            });
            if (!jobs) {
                return res.status(404).send({ message: 'No jobs found' });
            }
            return res.status(200).send({ message: 'Jobs found', jobs: jobs });
        } catch (err) {
            next(err);
        }
    }

    static async removeSavedJob(req, res, next) {
        try {
            const { jobId } = req.params;
            if (!jobId) {
                return res.status(400).send({ message: 'Job id is required' });
            }
            const user = await User.findOne({ where: { email: req.user.email } });
            if (!user) {
                return res.status(400).send({ message: 'User not found' });
            }
            await Saved.destroy({ where: { jobId: jobId } });
            return res.status(200).send({ message: 'Job removed' });
        } catch (err) {
            next(err);
        }
    }

    static async GetNotifications(req, res, next) { // TODO get noticed
        try {

        } catch (err) {

        }
    }
    static async GetNotificationById(req, res, next) { //TODO get more noticed
        try {

        } catch (err) {

        }
    }
}