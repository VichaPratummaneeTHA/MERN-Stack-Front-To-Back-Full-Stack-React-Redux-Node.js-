const express = require('express');
const router = express.Router();
const auth = require('../../middleware/auth');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const config = require('config');
const {check, validationResult} = require('express-validator');
const User = require('../../modoles/User');

// @route    GET api/auth
// @desc     Test route
// @access   Public

router.get('/', auth, async function(req, res){
 try {
   const user = await User.findById(req.user.id).select('-password');
   res.json(user);
 } catch (err) {
   console.error(err.message);
   res.status(500).send('Server Error');
 }
});

// @route    GET api/auth
// @desc     TAuthenticate user & get token
// @access   Public

router.post('/', 
[
  check('email', 'Please include a valid email')
  .isEmail(),
  check('password', 'Password is required')
  .exists()
],
  async (req, res) => {

  const errors = validationResult(req);
  if(!errors.isEmpty()){
    return res.status(400).json({ errors: errors.array()});
  }

  const { email, password} = req.body;

  try {

  // --- See if user exists --- //

  let user = await User.findOne({email});

  if(!user){
    return res.status(400).json({ errors: [{ msg: 'Invalid Credentials'}]});
  }

  // --- Match userpasswprd with Data Base --- //

  const isMatch = await bcrypt.compare(password, user.password);

  if(!isMatch){
    return res.status(400).json({ errors: [{ msg: 'Invalid Credentials'}]});
  }

  // --- Return jsonwebtoken --- //

  const payload = {
    user: {
      id: user.id
    }
  };

  jwt.sign(
    payload,
    config.get('jwtSecret'),
    { expiresIn: 360000},
    function(err, token){
      if(err){
        throw err;
      }else{
        res.json({ token });
      }
    }
  );
  console.log(req.body);
  // res.send('User Register Sucessed');

  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error....');
  }

 
 
});


module.exports = router;
