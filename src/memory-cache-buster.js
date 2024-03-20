const memoryCache = require("memory-cache");
const { getCacheKey } = require("./lib/getCacheKey");

const memoryCacheBuster = (namespace, headerKeys) => {
  return (req, res, next) => {
    memoryCache.del(getCacheKey(req, namespace, headerKeys));
    next();
  };
};

module.exports = { memoryCacheBuster };
