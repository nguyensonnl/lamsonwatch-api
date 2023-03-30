const Post = require("../models/Post");

//Get all posts
const getAllPost = async (req, res, next) => {
  try {
    const posts = await Post.find({}).populate("author");

    res.status(200).json({
      message: "success",
      results: posts.length,
      data: { posts },
    });
  } catch (error) {
    res.json(error);
  }
};

//Create one post
const createOnePost = async (req, res, next) => {
  try {
    const { userId } = req.user;

    const post = Post.create({ ...req.body, author: userId });
    res.status(200).json({
      status: "success",
      data: { post },
    });
  } catch (error) {
    res.status(error);
  }
};

//Update one post
const updateOnePost = async (req, res, next) => {
  try {
    const { postId } = req.params;
    const post = await Post.findBydIdAndUpdate(
      postId,
      { ...req.body },
      { new: true },
      { runValidator: true }
    );
    res.status(200).json({
      status: "success",
      data: { post },
    });
  } catch (error) {
    res.json(error);
  }
};

//delete one post
const deleteOnePost = async (req, res) => {
  try {
    const { postId } = req.params;
    await Post.findBydIdAndDelete(postId);
    res.status(200).json({
      status: "success",
      message: "Post has been deleted",
    });
  } catch (error) {
    res.json(error);
  }
};

module.exports = {
  getAllPost,
  createOnePost,
  updateOnePost,
  deleteOnePost,
};
