const Joi = require('joi');  

const reqSchema = Joi
    .object()
    .keys({
        subject: Joi
            .string()
            .trim(true)
            .max(50),
        text: Joi
            .string()
            .trim(true),
        tags: Joi
            .string()
            .trim(true)
    })
const reqInputValidator = (payload) => reqSchema.validate(payload);


module.exports = reqInputValidator;