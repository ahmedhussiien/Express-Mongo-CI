const express = require("express");
const Post = require("./models/post");
const router = express.Router();

router.get("/health", async (req, res) => {
  res.status(200).json({ message: "gmaeed!" });
});

router.get("/posts", async (req, res) => {
  const posts = await Post.find();
  res.json(posts);
});

router.post("/posts", async (req, res) => {
  if (!req.body.title || !req.body.content)
    return res.status(400).json({
      error: "Missing arguments!",
    });

  const post = new Post({
    title: req.body.title,
    content: req.body.content,
  });

  await post.save();

  res.status(201).json(post);
});

router.get("/posts/:id", async (req, res) => {
  try {
    const post = await Post.findOne({ _id: req.params.id });
    res.send(post);
  } catch {
    res.status(404);
    res.send({ error: "Post doesn't exist!" });
  }
});

router.patch("/posts/:id", async (req, res) => {
  try {
    const post = await Post.findOne({ _id: req.params.id });

    if (req.body.title) post.title = req.body.title;
    if (req.body.content) post.content = req.body.content;

    await post.save();
    res.send(post);
  } catch {
    res.status(404);
    res.send({ error: "Post doesn't exist!" });
  }
});

router.delete("/posts/:id", async (req, res) => {
  try {
    await Post.deleteOne({ _id: req.params.id });
    res.status(204).send();
  } catch {
    res.status(404);
    res.send({ error: "Post doesn't exist!" });
  }
});

module.exports = router;
