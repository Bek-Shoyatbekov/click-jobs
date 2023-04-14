const Joi = require('joi');

const updateUserSchema = Joi
    .object()
    .keys({
        banned: Joi
            .boolean(),
        allowToPost: Joi
            .boolean(),
        isVerified: Joi
            .boolean()
    })
const updateUserInputValidator = (payload) => updateUserSchema.validate(payload);

module.exports = updateUserInputValidator;