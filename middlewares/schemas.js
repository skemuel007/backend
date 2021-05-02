const Joi = require('joi')
const schemas = {
    signUpSchema: Joi.object().keys({
        name: Joi.string().required(),
        email: Joi.string().required().email(),
        password: Joi.string().min(6).required()
    }),

    sigInSchema: Joi.object().keys({
        email: Joi.string().required().email(),
        password: Joi.string().min(6).required(),
    })
};
module.exports = schemas;
