const Joi = require('@hapi/joi');

const registerValidation = (req) => {
  const schema = Joi.object({
    name: Joi.string()
      .min(6)
      .required(),
    email: Joi.string()
      .min(6)
      .required()
      .email(),
    password: Joi.string()
      .min(6)
      .required()
  })	
  return schema.validate(req);
}

const loginValidation = (req) => {
  const schema = Joi.object({
    email: Joi.string()
      .min(6)
      .required()
      .email(),
    password: Joi.string()
      .min(6)
      .required()
  })	
  return schema.validate(req);
}

module.exports.registerValidation = registerValidation;
module.exports.loginValidation = loginValidation;


