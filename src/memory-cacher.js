const memoryCache = require("memory-cache");
const { getCacheKey } = require("./lib/getCacheKey");

const memoryCacher = (duration, namespace, headerKeys) => {
  return (req, res, next) => {
    if (req.query.memoryCacher === "off") {
      next();
      return;
    }

    const url = req.originalUrl || req.url;
    const cacheKey = getCacheKey(url, namespace, req.headers, headerKeys);
    const cachedBody = memoryCache.get(cacheKey);
    if (cachedBody) {
      res.send(cachedBody);
    } else {
      res.preMemoryCachedSendFn = res.send;
      res.send = (body) => {
        memoryCache.put(cacheKey, body, duration ? duration * 1000 : undefined);
        res.send = res.preMemoryCachedSendFn;
        res.send(body);
      };
      next();
    }
  };
};

module.exports = { memoryCacher };
