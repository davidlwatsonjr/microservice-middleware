const crypto = require("crypto");

const getCacheKey = (req, namespace = "memory-cache", headerKeys = []) => {
  const url = req.originalUrl || req.url;
  const { headers } = req;
  const headerString = headerKeys
    .map((key) => key + "=" + headers[key])
    .join("&");
  const cacheKeyString = `${namespace}:${url}:${headerString}`;
  return crypto.createHash("md5").update(cacheKeyString).digest("hex");
};

module.exports = { getCacheKey };
