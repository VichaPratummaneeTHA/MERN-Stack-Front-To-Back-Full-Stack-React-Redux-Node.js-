const jwt = require('jsonwebtoken');
const config = require('config');

module.exports = function(req, res, next){

  //--- Get Token from Header ---//
  const token = req.header('x-auth-token');

  //--- Check if don't have the Token ---//
  if(!token){
    return res.status(401).json({ msg: 'No Token, authorization access denied'});
  }

  //--- Verify The Token ---//
  
  try {
    const decoded = jwt.verify(token, config.get('jwtSecret'));

    req.user = decoded.user;
    next();

  } catch (err) {
    console.error(err.message);
    res.ststus(401).json({ msg: 'Token is not valid'});
  }
}