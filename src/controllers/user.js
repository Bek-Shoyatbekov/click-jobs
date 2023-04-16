const db = require('../models/index');

const bcrypt = require('bcryptjs');

const { Op } = require('sequelize');

const signUpInputValidator = require('../utils/inputValidators/user/signup');

const generateAccessToken = require('../middlewares/auth/generateAccessToken');

const signInInputValidator = require('../utils/inputValidators/user/signin');

const updateInputValidator = require('../utils/inputValidators/user/update');

const emailInputValidator = require('../utils/inputValidators/user/email');

const resetPasswordInputValidator = require('../utils/inputValidators/user/code');

const sendEmail = require('../utils/email_service/send_email');

const { validate } = require('uuid');

const reqInputValidator = require('../utils/inputValidators/user/req');

const User = db.user;
const Code = db.code;

require('dotenv').config();

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
            let token = generateAccessToken(body.email);
            const hashedPassword = await bcrypt.hash(body.password, 10);
            const user = await User.create({
                username: body.username,
                email: body.email,
                password: hashedPassword,
                role: body.role,
                token: token
            });
            const result = await user.save();
            const email = body.email;
            const code = Math.floor(Math.random() * 10000)
                .toString()
                .padStart(4, "0");
            let verifyCode = await Code.create({
                userEmail: email,
                code: code
            });
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
            const code = req.body.code;
            if (String(code).length != 4) {
                return res.status(400).send({ message: 'Invalid verification code' });
            }
            const verifyCode = await Code.findOne({ where: { code: code } });
            if (!verifyCode) {
                return res.status(400).send({ message: 'Invalid verification code' });
            }
            const user = await User.findOne({ where: { email: verifyCode.userEmail } });
            if (!user) {
                return res.status(400).send({ message: 'Invalid verification code' });
            }
            const token = generateAccessToken(user.email);
            user.token = token;
            user.isVerified = true;
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
                if (!user.isVerified) {
                    msg = 'Please verify your email';
                }
                user.token = token;
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
            user.token = '';
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
            if (!user || user.token == "") {
                return res.status(400).send({ message: 'User not found!' });
            }
            return res.status(200).send(user);
        } catch (err) {
            next(err);
        }
    }

    static async updateProfile(req, res, next) { //   Only the owner can update profile . We can check weather user is valid or not through jwt token 
        try {
            if (Object.keys(req.body).length === 0 && Object.keys(req.files).length === 0) {
                return res.status(400).send({ message: 'Update profile failed!\nThere is nothing to be updated' });
            }
            if (!req.user.email) {
                return res.status(400).send({ message: 'User not registered!' });
            }
            const user = await User.findOne({ where: { email: req.user.email } });
            if (user.token == '') {
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
            let resume, userImage;
            if (req.files.image) {
                userImage = req.files['image'][0].path;
            }
            if (req.files.resume) {
                resume = req.files['resume'][0].path;
            }
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
                    image: userImage,
                    resume: resume,
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
    //comment
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

    static async search(req, res, next) { // TODO search 
        try {
            const { tags, minSalary, maxSalary, jobType } = req.params;



        } catch (err) {
            next(err);
        }
    }

}