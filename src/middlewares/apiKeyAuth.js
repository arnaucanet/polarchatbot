const { URL } = require("url");
const { validateClientCredentials } = require("../services/authService");

function readOriginHost(req) {
  const origin = req.headers.origin;
  const referer = req.headers.referer;

  const source = origin || referer;
  if (!source) return null;

  try {
    return new URL(source).hostname;
  } catch {
    return null;
  }
}

async function apiKeyAuth(req, _res, next) {
  try {
    const apiKey = req.headers["x-api-key"];
    const originHost = readOriginHost(req);

    const client = await validateClientCredentials({ apiKey, originHost });
    req.client = client;
    next();
  } catch (error) {
    next(error);
  }
}

module.exports = apiKeyAuth;
