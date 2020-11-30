const express = require('express');
const router = express.Router();
const { check, validationResult} = require('express-validator');
const auth = require('../../middleware/auth');

const User = require('../../modoles/User');
const Profile = require('../../modoles/Profile');
const Post = require('../../modoles/Post');

/* ---------- POST API -------- */

// @route    POST api/posts
// @desc     Create Post
// @access   Private

router.post('/',
[ auth, 
[
  check('text', 'Text is required')
  .not()
  .isEmpty()
]
]
, async function(req, res){

  const errors = validationResult(req);
  if(!errors.isEmpty()){
    return res.status(400).json({ errors: errors.array()});
  }

  const user = await User.findById(req.user.id).select('-password');

  try {

  const newPost = new Post({
    user: req.user.id,
    text: req.body.text,
    name: user.name,
    avatar: user.avatar
  });

  const post = await newPost.save();
  return res.json(post);
    
  } catch (err) {
    console.error(err.message);
    return res.status(500).send('server Error ...');
  }

});

// @route    POST api/posts/comment/:id
// @desc     Comment on a post
// @access   Private

router.post(
  '/comment/:id',
  [
    auth,
    [
      check('text', 'Text is required')
      .not()
      .isEmpty()
    ]
  ],
  async function(req, res){
    const errors = validationResult(req);
    if(!errors.isEmpty){
      return res.status(400).json({ errors: errors.array()});
    }

    const user = await User.findById(req.user.id).select('-password');
    const post = await Post.findById(req.params.id);

    try {

      const newComment = {
        user: req.user.id,
        text: req.body.text,
        name: user.name,
        avatar: user.avatar
      }
  
      post.comments.unshift(newComment);
  
      await post.save();
  
      return res.json(post.comments);
      
    } catch (err) {
      console.error(err.message);
      return res.status(500).json({ msg: 'Server Error ...'});
    }
    
  }
);

/* ---------- GET API -------- */

// @route    GET api/posts
// @desc     GET all posts
// @access   Public
router.get('/', async function(req, res){
  try {
    const posts = await Post.find().sort({ date: -1});

    return res.json(posts);

  } catch (err) {
    console.error(err.message);
    return res.status(500).send('server Error ...');
  }
});

// @route    GET api/posts/:id
// @desc     GET posts by id
// @access   Private
router.get('/:id', auth, async function(req, res){
  try {
    const post = await Post.findById(req.params.id);

    if(!post){
      return res.status(404).json({ msg: 'Post not found'});
    }
    
    return res.json(post);

  } catch (err) {
    console.error(err.message);
    if(err.kind === 'ObjectId'){
      return res.status(404).json({ msg: 'Post not found'});
    }
    return res.status(500).send('server Error ...');
  }
});

/* ---------- PUT API -------- */

// @route    PUT api/posts/like/:id
// @desc     PUT a posts when liked by user
// @access   Private

router.put('/like/:id', auth, async function(req, res){
  try {

    const post = await Post.findById(req.params.id);

    // Check if the already liked by the user

    if(post.likes.filter(like => like.user.toString() === req.user.id).length > 0){
      return res.status(400).json({ msg: 'Post Already liked by the user '});
    }

    post.likes.unshift({ user: req.user.id });
    await post.save();

    return res.json(post.likes);
    
  } catch (err) {
      console.error(err.message);
      return res.status(500).json({msg: 'Server Error ...' });
  }
});

// @route    PUT api/posts/unlike/:id
// @desc     PUT a posts when unliked by user
// @access   Private

router.put('/unlike/:id', auth, async function(req, res){
    try {

      const post = await Post.findById(req.params.id);
      
      // Check if the post still not liked by the user then cannot unlike
      if(post.likes.filter(like => like.user.toString() === req.user.id).length === 0){
        return res.status(400).json({ msg: 'Post has not been liked by this user yet ...'});
      }
      
      // Get Remove index 
      const removeIndex = post.likes.map(like => like.user.toString()).indexOf(req.user.id);

      post.likes.splice(removeIndex, 1);

      await post.save();

      return res.json(post.likes);
      
    } catch (err) {
      console.error(err.msg);
      return res.status(500).json({ msg: 'Server Error ...'});
    }
});


/* ---------- DELETE API -------- */

// @route    DELETE api/posts/:id
// @desc     DELETE posts by id
// @access   Private

router.delete('/:id', auth, async function(req, res){
  try {
    const post = await Post.findById(req.params.id);

    if(!post){
      return res.status(404).json({ msg: 'Post not found'});
    }

    // Check User match
    if(post.user.toString() !== req.user.id){
      return res.status(401).json({ msg: 'User not authorized'});
    }

    await post.remove();

    return res.json({ msg: 'Delete Post Successfully ...'});
    
  } catch (err) {
    console.error(err.message);
    if(err.kind === 'ObjectId'){
      return res.status(404).json({ msg: 'Post not found'});
    }
    return res.status(500).send('Server Error');
  }
});

// @route    DELETE api/posts/comment/:id/:comment_id
// @desc     DELETE comment 
// @access   Private

router.delete(
  '/comment/:id/:comment_id',
  auth,
  async function(req, res){
    try {
      const post = await Post.findById(req.params.id);

      // Pull Out Comment
      const comment = await post.comments.find(comment => comment.id === req.params.comment_id);

      // Make sure comment exist
      if(!comment){
        return res.status(404).json({ msg: 'Not Found the comment not exist ...'});
      }

      // Check owner user that create the post 
      if(comment.user.toString() !== req.user.id){
        return res.status(401).json({ msg: 'This User not authorized delete comment ...'});
      }

      // it everything okay 
      // Get Remove Index
      const removeIndex = post.comments
      .map(comment => comment.user.toString())
      .indexOf(req.user.id);

      post.comments.splice(removeIndex, 1);

      await post.save();

      return res.json(post.comments);


    } catch (err) {
      console.error(err.message);
      return res.status(500).send('Server Error ...');
    }
  }
);

module.exports = router;
