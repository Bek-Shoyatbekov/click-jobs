const Joi = require('joi');

const createJobSchema = Joi
    .object()
    .keys({
        title: Joi
            .string()
            .min(3)
            .max(50)
            .trim(true)
            .required(),
        description: Joi
            .string()
            .trim(true)
            .required(),
        jobType: Joi
            .string()
            .required(),
        tags: Joi
            .string(),
        salary: Joi
            .number()
            .required(),
        status: Joi
            .valid('closed', 'open', 'applied')
    })
const createJobInputValidator = (payload) => createJobSchema.validate(payload);


module.exports = createJobInputValidator;