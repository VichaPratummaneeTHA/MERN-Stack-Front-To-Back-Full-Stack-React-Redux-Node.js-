const express = require('express');
const request = require('request');
const config = require('config');
const router = express.Router();
const auth = require('../../middleware/auth');
const {check, validationResult} = require('express-validator');

const User = require('../../modoles/User');
const Profile = require('../../modoles/Profile');

/* ---------- POST API -------- */

// @route    Post api/profile
// @desc     Create or Update users profile
// @access   Private

router.post('/', 
[
  auth,
  [
    check('status', 'Staus is required')
    .not()
    .isEmpty(),
    check('skills', 'skills is required')
    .not()
    .isEmpty()
  ]
],async function(req, res){
  const errors = validationResult(req);
  if(!errors.isEmpty()){
    return res.status(400).json({ errors: errors.array()});
  }

  const {
    company,
    website,
    location,
    bio,
    status,
    githubusername,
    skills,
    youtube,
    facebook,
    twitter,
    instagram,
    linkedin
  } = req.body;

  // Build Profile Object
  const profileFields = {};
  profileFields.user = req.user.id;
  if(company) profileFields.company = company;
  if(website) profileFields.website = website;
  if(location) profileFields.location = location;
  if(bio) profileFields.bio = bio;
  if(status) profileFields.status = status;
  if(githubusername) profileFields.githubusername = githubusername;
  if(skills) {
    profileFields.skills = skills.split(',').map(skill => skill.trim());
  }

  //Build Social Object
  profileFields.social = {}
  if(youtube) profileFields.social.youtube = youtube;
  if(twitter) profileFields.social.twitter = twitter;
  if(facebook) profileFields.social.facebook = facebook;
  if(linkedin) profileFields.social.linkedin = linkedin;
  if(instagram) profileFields.social.instagram = instagram;

  try {
    let profile = await Profile.findOne({ user: req.user.id});

    if(profile){
      // if users exist Update To DB
      profile = await Profile.findOneAndUpdate(
        { user: req.user.id},
        { $set: profileFields},
        { new: true}
      );
      return res.json(profile);
    }

    // if newUser Create New Profile
    newProfile = new Profile(profileFields);
    await newProfile.save();

    return res.send(newProfile);

  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error ...');
  }
    // res.send('Hello');
});

/* ---------- GET API -------- */

// @route    GET api/profile/me
// @desc     GET current users profile
// @access   Private

router.get('/me', auth, async function(req, res){

  try {
    const profile = await Profile.findOne({ user: req.user.id})
    .populate('user', ['name', 'avatar']);
    
    if(!profile){
      return res.status(400).json({ msg: 'There is no profile for this user ...'});
    }

    return res.json(profile);
    
  } catch (err) {
    console.error(err.message);
    return res.status(500).send('Server Error ...');
  }

  // res.send('Profile Route');
});


// @route    GET api/profile
// @desc     GET all profiles
// @access   Public

router.get('/', async function(req, res){
  try {
    const allProfiles = await Profile.find().populate('user', ['name', 'avatar']);

    return res.send(allProfiles);
    
  } catch (err) {
    console.error(500).send('Server Error ...');
  }
});

// @route    GET api/profile/user/:user_id
// @desc     GET profile by user ID
// @access   Public

router.get('/user/:user_id', async function(req, res){

  const paramsUseId = req.params.user_id
  try {
    const profile = await Profile.findOne({ user: paramsUseId}).populate('user', ['name', 'avatar']);

    res.send(profile);

    if(!profile){
      return res.status(400).json({ msg: 'Profile not found'});
    }
  } catch (err) {
    console.error(err.message);
    if(err.kind == 'ObjectId'){
      return res.status(400).json({ msg: 'Profile not found'});
    }
    res.status(500),send('Server Error');
  }
});


// @route    GET api/profile/github/:username
// @desc     GET profile repos from Github
// @access   Public

router.get('/github/:username', function(req, res){
  try {
    const option = {
      uri: `https://api.github.com/users/${req.params.username}/repos?per_page=5&sort=created:asc&client_id=${config.get('githubClientId')}&client_secrect=${config.get('githubSecret')}`,
      method: 'GET',
      headers: {'user-agent': 'node.js'}
    };

    request(option, function(error, response, body){
      if(error){
        console.error(error.message);
      }
      if(response.statusCode !== 200){
        return res.status(404).json({ msg: 'No Github profile found'});
      }

        return res.json(JSON.parse(body));
    });
  } catch (err) {
    console.error(err.message);
    return res.status(500).send('Server Error ...');
  }
});



/* ---------- PUT API -------- */

// @route    Put api/profile/experience
// @desc     Add Profile Experience
// @access   Private
router.put('/experience'
,[auth, 
  [
    check('title', 'Title is required')
    .not()
    .isEmpty(),
    check('company', 'Compan is required')
    .not()
    .isEmpty(),
    check('from', 'From Date is required')
    .not()
    .isEmpty()
]], async function(req, res){
    const errors = validationResult(req);
    if(!errors.isEmpty()){
      return res.status(400).json({ errors: errors.array()});
    }

    const {title, company, location, from, to, current, description} = req.body;

    const newExp = {title, company, location, from, to, current, description}

    try {
      const profile = await Profile.findOne({ user: req.user.id});

      profile.experience.unshift(newExp);
      await profile.save(profile);

      return res.json(profile);
      
    } catch (err) {
      console.error(err.message);
      return res.status(500).send('Server Error ...');
    }
});

// @route    Put api/profile/education
// @desc     Add Profile education
// @access   Private
router.put('/education'
,[auth
,[
  check('school', 'School is requied')
  .not()
  .isEmpty(),
  check('degree', 'Degree is required')
  .not()
  .isEmpty(),
  check('fieldofstudy', 'Field of Stady is required')
  .not()
  .isEmpty(),
  check('from', 'From Date is required')
  .not()
  .isEmpty()
]], async function(req, res){
  const errors = validationResult(req);
  if(!errors.isEmpty()){
    return res.status(400).json({ errors: errors.array()});
  }

  const{school, degree, fieldofstudy, from, to, current, description} = req.body;

  const newEdu = {school, degree, fieldofstudy, from, to, current, description};

  try {
    const profile = await Profile.findOne({ user: req.user.id});
    profile.education.unshift(newEdu);
    await profile.save();

    return res.json(profile);
    
  } catch (err) {
    console.error(err.message);
    return res.status(500).send('Server Error ...');
  }
});

/* ---------- DELETE API -------- */

// @route    Delete api/profile
// @desc     Delete profie, user and posts
// @access   Private
router.delete('/', auth, async function(req, res){
  try {
    //@todo - remove user post

    //Remove Profile
    await Profile.findOneAndRemove({ user: req.user.id});

    //Remove User
    await User.findOneAndRemove({ _id: req.user.id});

    return res.json({ msg: 'User Deleted successfully ...'});    
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error ...');
  }
});

// @route    Delete api/profile/experience/:exp_id
// @desc     Delete experience from profile
// @access   Private
router.delete('/experience/:exp_id', auth, async function(req, res){
  try {
    const profile = await Profile.findOne({ user: req.user.id});

    // Get Remove By Index
    const removeIndex = profile.experience
    .map( item => item.id )
    .indexOf(req.params.exp_id);
    profile.experience.splice(removeIndex, 1);
    await profile.save();

    return res.json({msg: 'Delete experience succeccfully ...'});

  } catch (err) {
    console.error(err.message);
    return res.status(500).send('Server Error...');
  }
});

// @route    Delete api/profile/education/:edu_id
// @desc     Delete education from profile
// @access   Private
router.delete('/education/:edu_id', auth, async function(req, res){
  try {
    const profile = await Profile.findOne({ user: req.user.id});

    //Get Remove by index
    const removeIndex = profile.education
    .map(item => item.id)
    .indexOf(req.params.edu_id);
    profile.education.splice(removeIndex, 1);
    await profile.save();

    return res.json({ msg: 'Delete education successfully ...'});
    
  } catch (err) {
    console.error(err.message);
    return res.status(500).send('Server Error ...');
  }
});

module.exports = router;
