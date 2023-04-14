const Joi = require('joi');

const emailSchema = Joi
    .object()
    .keys({
        email: Joi
            .string()
            .email()
            .trim(true)
    })
const emailInputValidator = (payload) => emailSchema.validate(payload);


module.exports = emailInputValidator;