const express = require('express');
const Post = require('../models/Post'); // Assuming you have a Post model
const router = express.Router();

// Report a post
router.post('/:id/report', async (req, res) => {
  try {
    const postId = req.params.id;
    const userId = req.body.userId;

    // Example logic: Update the post to add the report
    const post = await Post.findById(postId);
    if (!post) {
      return res.status(404).json("Post not found");
    }

    // Add a report entry or increase report count, etc.
    post.reports = post.reports || [];
    post.reports.push({ userId, date: new Date() });

    await post.save();
    res.status(200).json("The post has been reported.");
  } catch (err) {
    res.status(500).json(err);
  }
});

module.exports = router;
