const memoryCache = require("memory-cache");
const { getCacheKey } = require("./lib/getCacheKey");

const memoryCacheBuster = (namespace, headerKeys, urls = []) => {
  return (req, res, next) => {
    if (!urls?.length) {
      urls = [req.originalUrl || req.url];
    }
    urls.map((url) =>
      memoryCache.del(getCacheKey(url, namespace, req.headers, headerKeys)),
    );
    next();
  };
};

module.exports = { memoryCacheBuster };
