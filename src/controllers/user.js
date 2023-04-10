const db = require('../models/index');
const bcrypt = require('bcryptjs');
const signUpInputValidator = require('../utils/inputValidators/user/signup');
const generateAccessToken = require('../middlewares/auth/generateAccessToken');
const signInInputValidator = require('../utils/inputValidators/user/signin');
const updateInputValidator = require('../utils/inputValidators/user/update');
const emailInputValidator = require('../utils/inputValidators/user/email');
const resetPasswordInputValidator = require('../utils/inputValidators/user/code');
const sendEmail = require('../utils/email_service/send_email');
const { validate } = require('uuid');
const User = db.user;
const Code = db.code;

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
            req.session.email = user.email;
            const result = await user.save();
            res.header('Authorization', 'Bearer' + token)
            return res.status(200).send({ message: 'User created', token: token });
        } catch (err) {
            next(err);
        }
    };

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
            const { error } = resetPasswordInputValidator(req.body);
            if (error) {
                return res.status(400).send(`Inputs not valid: ${error.details[0].message}`)
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
            return res.status(200).redirect('/');
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
                    email: req.body.email
                }
            });
            if (!user) {
                return res.status(401).send({ message: 'User not found' });
            }
            const passwordIsValid = await bcrypt.compare(req.body.password, user.password);

            if (!passwordIsValid) {
                return res.status(401).send({ message: 'Email or password  invalid' });
            } else {
                req.session.email = user.email;
                const token = generateAccessToken(user.email);
                user.token = token;
                await user.save();
                return res.status(200).send({
                    message: `Signed in`,
                    token: token
                })
            }

        } catch (err) {
            next(err);
        }

    };
    static async logout(req, res, next) {
        try {
            if (!req.session.user) {
                return res.status(400).send({ message: 'User not registered!' });
            }
            req.session.destroy();
            return res.status(200).send(`User log out successfully`);
        } catch (err) {
            next(err);
        }
    };


    static async getProfile(req, res, next) {
        try {
            if (!validate(req.params.userId)) {
                return res.status(400).send({ message: 'User id is not valid !' });
            }
            const user = await User.findOne({ where: { id: req.params.userId } });
            if (!user) {
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
            if (!user) {
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

    static async deleteProfile(req, res, next) { }



}