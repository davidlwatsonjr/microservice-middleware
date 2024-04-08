const {
  getCacheKey,
} = require("@davidlwatsonjr/microservice-middleware/src/lib/getCacheKey");
const storage = require("../lib/google-cloud-storage");

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
      return storage.deleteFile(cacheFilename);
    });
    next();
  };
};

module.exports = { gcStorageCacheBuster };
