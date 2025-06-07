const { prisma } = require("../prisma/prisma.client");

const create = async (req, res) => {
  try {
    const { title, text, tags } = req.body;
    const file = req.file;

    if (!title) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const tagsArr = tags?.split(",");

    const post = await prisma.post.create({
      data: {
        userId: req.user.id,
        title,
        text: text || "",
        media: file?.path || null,
        mediaType: file?.mimetype || null,
        tags: tagsArr?.length
          ? {
              createMany: {
                data: tagsArr?.map((tag) => ({
                  tagId: +tag,
                })),
              },
            }
          : {},
      },
      include: {
        tags: {
          omit: {
            postId: true,
            tagId: false,
          },
          include: {
            tag: true,
          },
        },
        comments: {
          include: {
            Post: false,
            User: false,
          },
        },
      },
    });

    res.status(201).json(post);
  } catch (error) {
    console.log(error);

    res.status(500).json({ message: "Unknown server error" });
  }
};

const getAllPosts = async (req, res) => {
  try {
    const { tags, title, limit } = req.query;

    let where = {};
    let take;

    if (tags) {
      let tagsArr = tags?.split(",");

      where.tags = {
        every: {
          tagId: {
            in: tagsArr.map((tag) => +tag),
          },
        },
      };
    }

    if (title) {
      where.title = {
        contains: title,
      };
    }

    if (take) {
      take = +limit;
    }

    const posts = await prisma.post.findMany({
      where,
      orderBy: {
        rating: "desc",
      },
      include: {
        User: {
          include: {
            comments: false,
            likes: false,
            posts: false,
          },
        },
        comments: {
          orderBy: {
            date: "desc",
          },
          include: {
            User: true,
          },
          omit: {
            userId: true,
            postId: true,
            id: true,
          },
        },
        tags: {
          omit: {
            postId: true,
            tagId: true,
          },
          include: {
            tag: true,
          },
        },
        favorites: {
          include: {
            user: true,
            post: true,
          },
        },
      },
      take: +limit || undefined,
    });

    res.status(200).json(posts);
  } catch (error) {
    console.log(error);

    res.status(500).json({ message: "Unknown server error" });
  }
};

const remove = async (req, res) => {
  try {
    const { id } = req.params;

    const remove = await prisma.post.delete({
      where: {
        id,
      },
    });

    res.status(204).json({});
  } catch (error) {
    res.status(500).json({ message: "Unknown server error" });
  }
};

const edit = async (req, res) => {
  try {
    const { id, title, text } = req.body;
    const file = req.file;

    if (!id) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const post = await prisma.post.findFirst({
      where: {
        id,
      },
    });

    if (!post) {
      return res.status(404).json({ message: "Post not found" });
    }

    if (post.userId !== req.user.id) {
      return res.status(403).json({ message: "Access denied" });
    }

    const updatedPost = await prisma.post.update({
      where: {
        id,
      },
      data: {
        title: title || post.title,
        text: text || post.text,
        media: file?.path || post.media,
      },
    });

    res.status(201).json(updatedPost);
  } catch (error) {
    res.status(500).json({ message: "Unknown server error" });
  }
};

const editRating = async (req, res) => {
  try {
    const { id, index } = req.body;

    if (!id || !index) {
      return res.status(400).json({ message: "All fields are required" });
    }

    if (index > Math.abs(index) > 1 || index === 0) {
      return res.status(400).json({ message: "Invalid index value" });
    }

    const post = await prisma.post.findFirst({
      where: {
        id,
      },
    });

    const updatedPost = await prisma.post.update({
      where: {
        id,
      },
      data: {
        rating: post.rating + +index,
      },
    });

    res.status(200).json(updatedPost);
  } catch (error) {
    res.status(500).json({ message: "Unknown server error" });
  }
};

const getById = async (req, res) => {
  try {
    const { id } = req.params;

    if (!id) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const post = await prisma.post.findUnique({
      where: {
        id,
      },
      include: {
        User: {
          include: {
            comments: false,
            likes: false,
            posts: false,
          },
        },
        comments: {
          include: {
            Post: false,
            User: true,
          },
        },
        tags: {
          omit: {
            postId: true,
            tagId: true,
          },
          include: {
            tag: true,
          },
        },
      },
    });

    res.status(200).json(post);
  } catch (error) {
    res.status(500).json({ message: "Unknown server error" });
  }
};

module.exports = {
  create,
  getAllPosts,
  remove,
  edit,
  editRating,
  getById,
};
