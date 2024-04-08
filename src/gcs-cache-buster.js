const { getCacheKey } = require("./lib/getCacheKey");

const gcStorageCacheBuster = (bucketName, namespace, headerKeys, urls = []) => {
  let bucket;
  try {
    const { Storage } = require("@google-cloud/storage");
    bucket = new Storage().bucket(bucketName);
  } catch (err) {}

  return (req, res, next) => {
    if (
      req.query.gcStorageCacher === "off" ||
      process.env.gcStorageCacher === "off" ||
      !bucket
    ) {
      next();
      return;
    }

    if (!urls?.length) {
      urls = [req.originalUrl || req.url];
    }
    urls.map((url) => {
      const cacheKey = getCacheKey(url, namespace, req.headers, headerKeys);
      const cacheFilename = `${namespace}/cache/${cacheKey}`;
      return bucket
        ?.file(cacheFilename)
        .delete()
        .catch(() => null);
    });
    next();
  };
};

module.exports = { gcStorageCacheBuster };
