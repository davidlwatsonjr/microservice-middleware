const { getCacheKey } = require("./lib/getCacheKey");

const gcStorageCacher = (bucketName, duration, namespace, headerKeys) => {
  let bucket;
  try {
    const { Storage } = require("@google-cloud/storage");
    bucket = new Storage().bucket(bucketName);
  } catch (err) {}

  return async (req, res, next) => {
    if (
      req.query.gcStorageCacher === "off" ||
      process.env.gcStorageCacher === "off" ||
      !bucket
    ) {
      next();
      return;
    }

    const url = req.originalUrl || req.url;
    const cacheKey = getCacheKey(url, namespace, req.headers, headerKeys);
    const cacheFilename = `${namespace}/cache/${cacheKey}`;

    const cacheObjectString = (
      await bucket
        ?.file(cacheFilename)
        .download()
        .catch(() => null)
    )?.toString();

    const cacheObject = cacheObjectString
      ? JSON.parse(cacheObjectString)
      : null;
    if (cacheObject && cacheObject.expires > Date.now()) {
      res.send(cacheObject.body);
    } else {
      res.preStorageCachedSendFn = res.send;
      res.send = (body) => {
        bucket?.file(cacheFilename).save(
          JSON.stringify({
            body,
            expires: Date.now() + (duration ? duration * 1000 : 0),
          }),
        );
        res.send = res.preStorageCachedSendFn;
        res.send(body);
      };
      next();
    }
  };
};

module.exports = { gcStorageCacher };
