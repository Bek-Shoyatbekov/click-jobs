const Joi = require('joi');

const signinSchema = Joi
    .object()
    .keys({
        email: Joi
            .string()
            .email()
            .trim(true),
        password: Joi
            .string()
            .regex(/[a-z0-9]/)
            .min(5)
            .max(15)
    })
const signInInputValidator = (payload) => {
    return signinSchema.validate(payload);
}

module.exports = signInInputValidator;