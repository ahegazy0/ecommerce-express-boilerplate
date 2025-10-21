const validate = (schema, property = "body") => {
  return (req, res, next) => {
    const { error } = schema.validate(req[property], { abortEarly: false });
    if (error) {
      const message = error.details.map((detail) => detail.message).join(", ");
      return res.jsend.fail({ message }, 400);
    }
    next();
  };
};

module.exports = validate;
