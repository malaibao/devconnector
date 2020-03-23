const express = require('express');
const router = express.Router();
const { check, validationResult } = require('express-validator');
const auth = require('../../middleware/auth');

const Post = require('../../models/Post');
const User = require('../../models/User');

// @route   POST api/post
// @desc    Create a post
// @access  Private
router.post(
  '/',
  [
    auth,
    [
      check('text', 'Text is required')
        .not()
        .isEmpty()
    ]
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    try {
      const user = await User.findById(req.user.id).select('-password');

      const newPost = new Post({
        text: req.body.text,
        name: user.name,
        avatar: user.avatar,
        user: req.user.id
      });

      const post = await newPost.save();

      res.json(post);
    } catch (err) {
      console.error(err.message);
      res.status(500).send('Server Error in Creating Post');
    }
  }
);

// @route   Get api/posts
// @desc    Get all posts
// @access  Private
router.get('/', auth, async (req, res) => {
  try {
    const posts = await Post.find().sort({ date: -1 });
    res.json({ posts });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error in Getting Posts');
  }
});

// @route   GET api/posts/:post_id
// @desc    Get post by Id
// @access  Private
router.get('/:id', auth, async (req, res) => {
  try {
    Post.findOneAndRemove(req.params.id);
    if (!post) return res.status(404).json({ msg: 'Post not found' });

    res.json({ post });
  } catch (err) {
    if (err.kind === 'ObjectId')
      return res.status(404).json({ msg: 'Post not found' });
    console.error(err.message);
    res.status(500).send('Server Error in Getting Post');
  }
});

// @route   DELETE api/posts/:post_id
// @desc    Remove post by Id
// @access  Private
router.delete('/:id', auth, async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);

    // Check if post exists
    if (!post) return res.status(404).json({ msg: 'Post not found' });

    // Check if it is post owner
    if (post.user.toString() !== req.user.id) {
      return res.status(401).json({ msg: 'User not authorized' });
    }

    await post.remove();

    res.json({ msg: 'Post removed' });
  } catch (err) {
    if (err.kind === 'ObjectId')
      return res.status(404).json({ msg: 'Post not found' });
    console.error(err.message);
    res.status(500).send('Server Error in Deleting Post');
  }
});

module.exports = router;
