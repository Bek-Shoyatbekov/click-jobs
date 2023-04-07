const Joi = require('joi');

const signupSchema = Joi
    .object()
    .keys({
        username: Joi
            .string()
            .alphanum()
            .min(3)
            .max(50)
            .trim(true)
            .required(),
        email: Joi
            .string()
            .email()
            .trim(true),
        bio: Joi
            .string(),
        password: Joi
            .string()
            .regex(/[a-z0-9]/)
            .min(5)
            .max(15)
    })
const signUpInputValidator = (payload) => {
    return signupSchema.validate(payload);
}

module.exports = signUpInputValidator;