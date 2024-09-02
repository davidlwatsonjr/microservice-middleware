const authAPIRequest = (serviceName = "") => {
  const apiKeyName = serviceName ? `${serviceName}_API_KEY` : "API_KEY";
  const API_KEY = process.env[apiKeyName];

  return (req, res, next) => {
    const { headers } = req;

    if (headers["x-api-key"] !== API_KEY) {
      console.warn(`Invalid API key: ${headers["x-api-key"]}`);
      res.status(401).send({ error: "Invalid API key" });
    } else {
      next();
    }
  };
};

module.exports = { authAPIRequest };
