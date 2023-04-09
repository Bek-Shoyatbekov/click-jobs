const Joi = require('joi');

const resetPasswordSchema = Joi
    .object()
    .keys({
        email: Joi
            .string()
            .email()
            .trim(true)
        ,
        password: Joi
            .string()
            .min(5)
            .max(15)
        ,
    })
const resetPasswordInputValidator = (payload) => {
    return resetPasswordSchema.validate(payload);
}

module.exports = resetPasswordInputValidator;