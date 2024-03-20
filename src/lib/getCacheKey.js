const crypto = require("crypto");

const getCacheKey = (
  url,
  namespace = "memory-cache",
  headers = [],
  headerKeys = [],
) => {
  const headerString = headerKeys
    .map((key) => key + "=" + headers[key])
    .join("&");
  const cacheKeyString = `${namespace}:${url}:${headerString}`;
  return crypto.createHash("md5").update(cacheKeyString).digest("hex");
};

module.exports = { getCacheKey };
