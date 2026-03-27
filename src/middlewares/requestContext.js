function requestContext(req, _res, next) {
  req.context = {
    requestStartAt: Date.now()
  };
  next();
}

module.exports = requestContext;
