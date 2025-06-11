const { prisma } = require("../prisma/prisma.client");

const favorite = async (req, res) => {
  try {
    const { postId } = req.body;

    if (!postId) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const favorite = await prisma.favorite.create({
      data: {
        postId,
        userId: req.user.id,
      },
    });

    res.status(201).json({ status: "success" });
  } catch (error) {
    res.status(500).json({ message: "Unknown server error" });
  }
};

const remove = async (req, res) => {
  try {
    const { postId } = req.body;

    if (!postId) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const favorite = await prisma.favorite.delete({
      where: {
        userId_postId: { postId, userId: req.user.id },
      },
    });

    res.status(200).json({ status: "success" });
  } catch (error) {
    console.log(error);

    res.status(500).json({ message: "Unknown server error" });
  }
};

const isFavorite = async (req, res) => {
  try {
    const { postId } = req.params;

    if (!postId) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const favorite = await prisma.favorite.findFirst({
      where: {
        postId,
        userId: req.user.id,
      },
    });

    if (!favorite) {
      res.status(200).json({ isFavorite: false });
    }

    res.status(200).json({ isFavorite: !!favorite });
  } catch (error) {
    console.log(error);

    res.status(500).json({ message: "Unknown server error" });
  }
};

module.exports = {
  favorite,
  remove,
  isFavorite,
};
