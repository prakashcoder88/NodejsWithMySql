const jwt = require("jsonwebtoken");

const responseMsg = require("../utils/ResponseMessage.json");
const { key_Token, adminkey_Token, Token_expiry } = process.env;

const UserValidateToken = (req, res, next) => {
  const token = req.body.token || req.headers["authorization"];

  if (!token) {
    return res.status(403).send({ Msg: responseMsg.TOKENAUTH });
  }
  try {
    const decodeToken = jwt.verify(token, key_Token);
    req.currentUser = decodeToken.id;
  } catch (error) {
    return res.status(401).send({ Msg: responseMsg.TOKENINVALID });
  }
  return next();
};

const adminauthenticationToken = (req, res, next) => {
  const admintoken = req.headers["authorization"];

  if (!admintoken) {
    return res.status(401).send({ Msg: responseMsg.TOKENAUTH });
  }
  try {
    const decoded = jwt.verify(admintoken, adminkey_Token);

    req.AdminUser = decoded.id;
  } catch (error) {
    return res.status(401).send({ Msg: responseMsg.TOKENINVALID });
  }
  return next();
};

const blockTokens = new Set();

module.exports = { UserValidateToken, adminauthenticationToken, blockTokens };
