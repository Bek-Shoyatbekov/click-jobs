const Joi = require('joi');

const signupSchema = Joi
    .object()
    .keys({
        username: Joi
            .string()
            .min(3)
            .max(50)
            .trim(true)
            .required(),
        email: Joi
            .string()
            .email()
            .trim(true)
            .required(),
        bio: Joi
            .string(),
        password: Joi
            .string()
            .min(5)
            .max(15)
            .required(),
        role: Joi
            .valid('user', 'applicant')
            .required()
    })
const signUpInputValidator = (payload) => signupSchema.validate(payload);


module.exports = signUpInputValidator;