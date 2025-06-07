const { prisma } = require("../prisma/prisma.client");

const create = async (req, res) => {
  try {
    const { postId, text } = req.body;

    if (!text || !postId) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const comment = await prisma.comment.create({
      data: {
        text,
        postId,
        userId: req.user.id,
      },
      include: {
        User: {
          include: {
            comments: false,
            posts: false,
          },
        },
      },
    });

    return res.status(201).json(comment);
  } catch (error) {
    console.log(error);

    res.status(500).json({ message: "Unknown server error" });
  }
};

const remove = async (req, res) => {
  try {
    const { id } = req.params;

    const comments = await prisma.comment.delete({
      where: {
        id,
      },
    });

    res.status(204).json({});
  } catch (error) {
    res.status(500).json({ message: "Unknown server error" });
  }
};


module.exports = {
  create,
  remove,
};
