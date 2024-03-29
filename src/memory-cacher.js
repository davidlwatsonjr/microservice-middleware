const memoryCache = require("memory-cache");
const { getCacheKey } = require("./lib/getCacheKey");

const memoryCacher = (duration, namespace, headerKeys) => {
  return (req, res, next) => {
    const url = req.originalUrl || req.url;
    const cacheKey = getCacheKey(url, namespace, req.headers, headerKeys);
    const cachedBody = memoryCache.get(cacheKey);
    if (cachedBody) {
      res.send(cachedBody);
      return;
    } else {
      res.sendResponse = res.send;
      res.send = (body) => {
        memoryCache.put(cacheKey, body, duration ? duration * 1000 : undefined);
        res.sendResponse(body);
      };
      next();
    }
  };
};

module.exports = { memoryCacher };
