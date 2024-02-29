const requestLogger = (req, res, next) => {
  console.log(`${req.method} ${req.url} HTTP/${req.httpVersion}`);
  next();
};

const gcpLogTransformer = (req, res, next) => {
  const { headers } = req;

  // If the request is being handled by a Google Cloud Run service
  // Update the appropriate console functions
  if (headers["x-cloud-trace-context"] && !console._logsAreGCPFriendly) {
    console._info = console.info;
    console.info = (message) =>
      console._info(JSON.stringify({ severity: "INFO", message }));

    console._warn = console.warn;
    console.warn = (message) =>
      console._warn(JSON.stringify({ severity: "WARNING", message }));

    console._error = console.error;
    console.error = (message) =>
      console._error(JSON.stringify({ severity: "ERROR", message }));

    // Set a flag to avoid reapplying the transformation
    // if the middleware is executed multiple times
    console._logsAreGCPFriendly = true;
  }

  next();
};

module.exports = { gcpLogTransformer, requestLogger };
