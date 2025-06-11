const { prisma } = require("../prisma/prisma.client");

const like = async (req, res) => {
  try {
    const { postId } = req.params;

    const existing_like = await prisma.like.findUnique({
      where: {
        userId_postId: {
          postId,
          userId: req.user.id,
        },
      },
    });

    if (existing_like) {
      return res
        .status(400)
        .json({ message: "Like already exist on this post" });
    }

    const like = await prisma.like.create({
      data: {
        postId,
        userId: req.user.id,
      },
    });

    const post = await prisma.post.update({
      where: {
        id: postId,
      },
      data: {
        rating: {
          increment: 1,
        },
      },
    });

    res.status(200).json({ rating: post.rating });
  } catch (error) {
    console.log(error);

    res.status(500).json({ message: "Unknown server error" });
  }
};

const unlike = async (req, res) => {
  try {
    const { postId } = req.params;

    const existing_like = await prisma.like.findUnique({
      where: {
        userId_postId: {
          postId,
          userId: req.user.id,
        },
      },
    });

    if (!existing_like) {
      return res
        .status(400)
        .json({ message: "There is not like on this post" });
    }

    const like = await prisma.like.delete({
      where: {
        userId_postId: {
          postId,
          userId: req.user.id,
        },
      },
    });

    const post = await prisma.post.update({
      where: {
        id: postId,
      },
      data: {
        rating: {
          decrement: 1,
        },
      },
    });

    res.status(200).json({ rating: post.rating });
  } catch (error) {
    console.log(error);

    res.status(500).json({ message: "Unknown server error" });
  }
};

const isLiked = async (req, res) => {
  try {
    const { postId } = req.params;

    const like = await prisma.like.findUnique({
      where: {
        userId_postId: {
          userId: req.user.id,
          postId: postId,
        },
      },
    });

    res.status(200).json({ isLiked: !!like });
  } catch (error) {
    console.log(error);

    res.status(500).json({ message: "Unknown server error" });
  }
};

module.exports = {
  like,
  unlike,
  isLiked,
};
