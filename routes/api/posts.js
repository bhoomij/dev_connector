const express = require('express');
const passport = require('passport');

const router = express.Router();
const common = require('../../common/func');
// Load Post model
const Post = require('../../models/Post');
// Load post validator
const validatePostInput = require('../../validation/post');

// @route    GET /api/posts/test
// @desc     Test post route
// @access  Public
router.get('/test', (req, res) => res.json({
    "msg": "Posts works"
}));

// @route   GET /api/posts
// @desc    Get Posts 
// @access  Public
router.get('/', common.catchErrors(async (req, res) => {
    errors = {};
    const posts = await Post.find();
    if (!posts) {
        errors.posts = 'No posts found';
        return res.json(errors);
    }
    res.json(posts.sort({
        date: -1
    }));
}));

// @route   GET /api/posts/:id
// @desc    Get post
// @access  Public
router.get('/:id', async (req, res) => {
    try {
        errors = {};
        const post = await Post.findById(req.params.id);
        if (!post) {
            errors.post = 'No post found';
            return res.json(errors);
        }
        res.json(post);
    } catch (err) {
        errors.post = 'No post found';
        return res.json(errors);
    }
});

// @route   POST /api/posts
// @desc    Create post
// @access  Private
router.post('/', passport.authenticate('jwt', {
    session: false
}), common.catchErrors(async (req, res) => {
    const {
        errors,
        isValid
    } = validatePostInput(req.body);
    if (!isValid) {
        return res.status(400).json(errors);
    }
    //get post fields
    const newPost = {
        text: req.body.text,
        user: req.user.id,
        name: req.body.name,
        avatar: req.body.avatar,
    }
    const post = await new Post(newPost).save();
    if (!post) {
        errors.post = 'Error while creating post';
        return res.json(errors);
    }
    res.json(post);
}));

// @route   DELETE /api/posts/:id
// @desc    Delete post
// @access  Public
router.delete('/:id', passport.authenticate('jwt', {
    session: false
}), async (req, res) => {
    try {
        errors = {};
        const post = await Post.findById(req.params.id);
        if (!post) {
            errors.post = 'Post not found';
            return res.status(404).json(errors);
        }
        if (post.user.toString() !== req.user.id) {
            errors.post = 'User not authorized';
            return res.status(401).json(errors);
        }
        await post.remove();
        res.json({
            success: true
        });
    } catch (err) {
        errors.post = 'Post not found';
        return res.status(404).json(errors);
    }
});

// @route   /api/posts/like/:id
// @desc    Like post
// @access  Private
router.post('/like/:id', passport.authenticate('jwt', {
    session: false
}), async (req, res) => {
    try {
        errors = {};
        const post = await Post.findById(req.params.id);
        if (!post) {
            errors.post = 'Post not found';
            return res.status(404).json(errors);
        }
        if (post.likes.some(user => user._id == req.user.id)) {
            errors.post = 'You have already liked the post';
            return res.status(404).json(errors);
        }
        post.likes.unshift(req.user.id);
        const result = await post.save();
        res.json(result);
    } catch (err) {
        errors.post = 'Post not found';
        return res.status(404).json(errors);
    }
});

// @route   /api/posts/unlike/:id
// @desc    Unlike post
// @access  Private
router.post('/unlike/:id', passport.authenticate('jwt', {
    session: false
}), async (req, res) => {
    try {
        errors = {};
        const post = await Post.findById(req.params.id);
        if (!post) {
            errors.post = 'Post not found';
            return res.status(404).json(errors);
        }
        const removeIndex = post.likes.findIndex(user => user._id == req.user.id)
        if (removeIndex < 0) {
            errors.post = 'You have not liked the post';
            return res.status(404).json(errors);
        };
        post.likes.splice(removeIndex, 1);
        const result = await post.save();
        res.json(result);
    } catch (err) {
        errors.post = 'Post not found';
        return res.status(404).json(errors);
    }
});

// @route   POST /api/posts/comment/:id
// @desc    Add comment to post
// @access  Private
router.post('/comment/:id', passport.authenticate('jwt', {
    session: false
}), async (req, res) => {
    try {
        const {
            errors,
            isValid
        } = validatePostInput(req.body);
        if (!isValid) {
            return res.status(400).json(errors);
        }
        const post = await Post.findById(req.params.id);
        if (!post) {
            errors.post = 'Post not found';
            return res.status(404).json(errors);
        }
        newComment = {
            text: req.body.text,
            name: req.body.name,
            avatar: req.body.avatar,
            user: req.user.id,
        }
        post.comments.unshift(newComment);
        const result = await post.save();
        res.json(result);
    } catch (err) {
        errors = {};
        errors.post = 'Post not found';
        return res.status(404).json(errors);
    }
});

// @route   DELETE /api/posts/comment/:id
// @desc    Delete comment from post
// @access  Private
router.delete('/comment/:id/:commentId', passport.authenticate('jwt', {
    session: false
}), async (req, res) => {
    errors = {};
    try {
        const post = await Post.findById(req.params.id);
        if (!post) {
            errors.post = 'Post not found';
            return res.status(404).json(errors);
        }
        const removeIndex = post.comments.findIndex(comment => comment._id == req.params.commentId)
        if (removeIndex < 0) {
            errors.comment = 'Comment not found';
            return res.status(404).json(errors);
        }
        if (post.comments[removeIndex].user != req.user.id) {
            errors.comment = 'Not authorized to delete comment';
            return res.status(404).json(errors);
        }
        post.comments.splice(removeIndex, 1);
        const result = await post.save();
        res.json(result);
    } catch (err) {
        errors.post = 'Post not found';
        return res.status(404).json(errors);
    }
});

module.exports = router;