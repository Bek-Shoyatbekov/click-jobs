const Joi = require('joi');

const updateSchema = Joi
    .object()
    .keys({
        username: Joi
            .string()
            .alphanum()
            .min(3)
            .max(50)
            .trim(true),
        email: Joi
            .string()
            .email()
            .trim(true)
        ,
        bio: Joi
            .string(),
        password: Joi
            .string()
            .min(5)
            .max(15)
        ,
        role: Joi
            .valid('user', 'aplicant')

    })
const updateInputValidator = (payload) => {
    return updateSchema.validate(payload);
}

module.exports = updateInputValidator;