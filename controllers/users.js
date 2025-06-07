const { prisma } = require("../prisma/prisma.client");

const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const register = async (req, res) => {
  try {
    const { login, password, description, name } = req.body;
    const file = req.file;

    if (!login || !password || !name) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const isExist = await prisma.user.findFirst({
      where: {
        login,
      },
    });

    if (isExist) {
      return res.status(400).json({
        message: "User already exist ",
      });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const user = await prisma.user.create({
      data: {
        name,
        login,
        description: description || "",
        avatar: file?.path || "public/no-photo.png",
        password: hashedPassword,
        role: "USER",
      },
    });

    if (!user) {
      return res.status(400).json({ message: "Failed to register user" });
    }

    const token = jwt.sign({ id: user.id }, process.env.SECRET, {
      expiresIn: "30d",
    });

    res.status(201).json({
      ...user,
      token,
    });
  } catch (error) {
    console.log(error);

    res.status(500).json({ message: "Unknown server error" });
  }
};

const login = async (req, res) => {
  try {
    const { login, password } = req.body;

    console.log(req.body);

    if (!login || !password) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const user = await prisma.user.findFirst({
      where: {
        login,
      },
    });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const isPasswordCorrect = await bcrypt.compare(password, user.password);

    const token = jwt.sign({ id: user.id }, process.env.SECRET, {
      expiresIn: "30d",
    });

    if (user && isPasswordCorrect) {
      res.status(200).json({ ...user, token });
    } else {
      res.status(400).json({ message: "Incorrect login data" });
    }
  } catch (error) {
    console.log(error);

    res.status(500).json({ message: "Unknown server error" });
  }
};

const current = async (req, res) => {
  try {
    res.status(200).json({ data: req.user });
  } catch (error) {
    res.status(500).json({ message: "Unknown server error" });
  }
};

const edit = async (req, res) => {
  try {
    const data = req.body;
    const file = req.file;

    const user = await prisma.user.update({
      where: {
        id: req.user.id,
      },
      data: {
        avatar: file?.path || req.user.avatar,
        name: data?.name || req.user.name,
        description: data?.description || req.user.description,
        bio: data?.bio || req.user.bio,
        Exhibitions: data?.Exhibitions || req.user.Exhibitions,
        Education: data?.Education || req.user.Education,
      },
    });

    res.status(200).json(user);
  } catch (error) {
    console.log(error);

    res.status(500).json({ message: "Unknown server error" });
  }
};

const getById = async (req, res) => {
  try {
    const { id } = req.params;

    if (!id) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const user = await prisma.user.findUnique({
      where: {
        id: +id,
      },
      include: {
        posts: {
          include: {
            User: true,
            comments: {
              include: {
                User: {
                  include: {
                    comments: true,
                    likes: false,
                    posts: false,
                  },
                },
              },
            },

            tags: {
              include: {
                post: false,
                tag: false,
              },
            },
          },
        },
        likes: {
          include: {
            Post: {
              include: {
                User: true,
                comments: {
                  include: {
                    User: true,
                  },
                },
              },
            },
            User: true,
          },
        },
        subscriptions: {
          include: {
            subscribedTo: true,
          },
        },
        subscribedTo: true,
        Favorite: {
          include: {
            post: {
              include: {
                comments: {
                  include: {
                    User: true,
                  },
                },
                User: true,
              },
            },
            user: true,
          },
        },
      },
    });

    res.status(200).json(user);
  } catch (error) {
    console.log(error);

    res.status(500).json({ message: "Unknown server error" });
  }
};

const setBanner = async (req, res) => {
  try {
    const file = req.file;

    if (!file?.path) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const user = await prisma.user.update({
      where: {
        id: req.user.id,
      },
      data: {
        banner: file.path,
      },
    });

    res.status(200).json(user);
  } catch (error) {
    res.status(500).json({ message: "Unknown server error" });
  }
};

const getAll = async (req, res) => {
  try {
    const { limit } = req.query;

    console.log(limit);

    const users = await prisma.user.findMany({
      orderBy: {
        subscribedTo: {
          _count: "desc",
        },
      },
      take: +limit || undefined,
      include: {
        subscribedTo: true,
        posts: true,
      },
    });

    res.status(200).json(users);
  } catch (error) {
    console.log(error);
  }
};

module.exports = {
  register,
  login,
  current,
  edit,
  getById,
  setBanner,
  getAll,
};
