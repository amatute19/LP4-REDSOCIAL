const router = require("express").Router();
const Post = require("../models/Post");
const User = require("../models/User");




//create a post

router.post("/", async (req, res) => {
  const newPost = new Post(req.body);
  try {
    const savedPost = await newPost.save();
    res.status(200).json(savedPost);
  } catch (err) {
    res.status(500).json(err);
  }
});

//update a post

router.put("/:id", async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (post.userId === req.body.userId) {
      await post.updateOne({ $set: req.body });
      res.status(200).json("El post fue actualizado correctamente");
    } else {
      res.status(403).json("Solo puedes actualizar tu post");
    }
  } catch (err) {
    res.status(500).json(err);
  }
});
//delete a post

router.delete("/:id", async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (post.userId === req.body.userId) {
      await post.deleteOne();
      res.status(200).json("EL post ha sido eliminado");
    } else {
      res.status(403).json("No puedes borrar post de otros usuarios");
    }
  } catch (err) {
    res.status(500).json(err);
  }
});
//like / dislike a post

router.put("/:id/like", async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post.likes.includes(req.body.userId)) {
      await post.updateOne({ $push: { likes: req.body.userId } });
      res.status(200).json("Has dado like al post");
    } else {
      await post.updateOne({ $pull: { likes: req.body.userId } });
      res.status(200).json("Has dado disliked");
    }
  } catch (err) {
    res.status(500).json(err);
  }
});

// Obtener post por ID de usuario
router.get("/:id", async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    res.status(200).json(post);
  } catch (err) {
    res.status(500).json(err);
  }
});

//get timeline posts

router.get("/timeline/:userId", async (req, res) => {
  try {
    const currentUser = await User.findById(req.params.userId);
    const userPosts = await Post.find({ userId: currentUser._id });
    const friendPosts = await Promise.all(
      currentUser.followings.map((friendId) => {
        return Post.find({ userId: friendId });
      })
    );
    res.status(200).json(userPosts.concat(...friendPosts));
  } catch (err) {
    res.status(500).json(err);
  }
});



//get user's all posts

router.get("/profile/:username", async (req, res) => {
  try {
    const user = await User.findOne({ username: req.params.username });
    const posts = await Post.find({ userId: user._id });
    res.status(200).json(posts);
  } catch (err) {
    res.status(500).json(err);
  }
});

// Get comments for a post
router.get("/:id/comments", async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    res.status(200).json(post.comments);
  } catch (err) {
    res.status(500).json(err);
  }
});

// Add comment to a post
router.post("/:id/comment", async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    const newComment = {
      userId: req.body.userId,
      comment: req.body.comment,
    };
    post.comments.push(newComment);
    await post.save();
    res.status(200).json(newComment); // Returning the new comment
  } catch (err) {
    res.status(500).json(err);
  }
});


// Crear un post
// router.post("/", async (req, res) => {
//   const newPost = new Post(req.body);
//   try {
//     const savedPost = await newPost.save();
//     res.status(200).json(savedPost);
//   } catch (err) {
//     res.status(500).json(err);
//   }
// });


// Obtener todos los posts
router.get("/", async (req, res) => {
  try {
    const posts = await Post.find().sort({ createdAt: -1 });
    res.status(200).json(posts);
  } catch (err) {
    res.status(500).json(err);
  }
});
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
    res.status(200).json("La publicación ha sido reportada.");
  } catch (err) {
    res.status(500).json(err);
  }
});
// Obtener post por ID de usuario
// router.get("/:id", async (req, res) => {
//   try {
//     const post = await Post.findById(req.params.id);
//     res.status(200).json(post);
//   } catch (err) {
//     res.status(500).json(err);
//   }
// });

module.exports = router;