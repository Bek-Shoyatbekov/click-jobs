const db = require('../models/index');
const bcrypt = require('bcryptjs');
const signUpInputValidator = require('../utils/inputValidators/user/signup');
const generateAccessToken = require('../middlewares/auth/generateAccessToken');
const signInInputValidator = require('../utils/inputValidators/user/signin');

const User = db.user;

module.exports = class UserController {
    static async signup(req, res, next) {
        try {
            let body;
            const exists = await User.findOne({
                where:
                {
                    email: req.body.email
                }
            })
            if (exists) {
                return res.status(400).send({ message: 'User already exists' });
            }
            const { error, value } = signUpInputValidator(req.body);
            if (error) {
                return res.status(400).send(`Inputs not valid: ${error.details[0].message}`)
            } else {
                body = value;
            }
            const hashedPassword = await bcrypt.hash(body.password, 10);
            const user = await User.create({
                username: body.username,
                email: body.email,
                password: hashedPassword,
                role: body.role,
                bio: body.about,
            });
            req.session.email = user.email;
            let token = generateAccessToken(body.email);
            const result = await user.save();
            res.header('Authorization', 'Bearer' + token)
            return res.status(201).send({ message: 'User created', token: token });
        } catch (err) {
            next(err);
        }
    };
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
            return res.redirect('/');
        } catch (err) {
            next(err);
        }
    };


    static async getProfile(req, res, next) {
        try {
            // if (!req.session.user) {
            //     return res.status(400).send({ message: 'User not registered!' });
            // }
            const user = await User.findOne({ where: { id: req.params.userId } });
            if (!user) {
                return res.status(400).send({ message: 'User not found!' });
            }
            return res.status(200).send(user);
        } catch (err) {
            next(err);
        }
    }


    static async updateProfile(req, res, next) {
        try {
        
            if (!req.session.user || req.session.user.id != req.params.userId) {
                return res.status(400).send({ message: 'User not registered!' });
            }
            const body = req.body;
            let resume, userImage;
            if (req.files) {

                userImage = req.files['image'][0].path || '';
                resume = req.files['resume'][0].path || '';
            }
            const user = await User.findOne({ where: { id: req.params.userId } });
            if (!user) {
                return res.status(400).send({ message: 'User not found!' });
            }
            
            const hashedPassword = await bcrypt.hash(body.password, 10);
            const result = await User.update(
                {
                    name: body.name,
                    email: body.email,
                    phone: body.phone,
                    password: hashedPassword,
                    image: userImage,
                    resume: resume,
                    bio: body.bio,
                    role: body.role
                },
                {
                    where:
                    {
                        email: req.session.user.email
                    }
                })
            console.log(`User updated`);
            return res.status(204).redirect('/profile');
        } catch (err) {
            next(err);
        }
    }

    static async deleteProfile(req, res, next) { }

    static async deleteProfile(req, res, next) { }




}