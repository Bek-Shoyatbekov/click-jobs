const Joi = require('joi');

const updateSchema = Joi
    .object()
    .keys({
        username: Joi
            .string()
            .min(3)
            .max(50)
            .trim(true),
        email: Joi
            .string()
            .email()
            .trim(true),
        bio: Joi
            .string(),
        password: Joi
            .string()
            .min(5)
            .max(15),
        role: Joi
            .valid('user', 'applicant')
    })
const updateInputValidator = (payload) => updateSchema.validate(payload);

module.exports = updateInputValidator;