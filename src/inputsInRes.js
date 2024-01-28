const inputsInRes = (req, res, next) => {
  const { body, query, params } = req;
  res.locals.inputs = { body, query, params };
  next();
};

module.exports = { inputsInRes };
