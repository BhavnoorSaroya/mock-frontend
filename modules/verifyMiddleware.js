module.exports = (verifier) => (req, res, next) => {
  const signature = req.headers['x-gateway-signature'];
  const url = req.url;
  const method = req.method;
  const payload = `${method}${url}`;
  if (!verifier.verifySignature(signature, payload)) {
    return res.status(401).send('Invalid signature');
  }
  // Call route handler 
  next();
};
