const { prisma } = require("../prisma/prisma.client");

const create = async (req, res) => {
  try {
    const { name } = req.body;

    if (!name) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const tag = await prisma.tag.create({
      data: {
        name,
      },
    });

    res.status(201).json(tag);
  } catch (error) {
    res.status(500).json({ message: "Unknown server error" });
  }
};

const getAll = async (req, res) => {
  try {
    const tags = await prisma.tag.findMany();

    res.status(200).json(tags);
  } catch (error) {
    res.status(500).json({ message: "Unknown server error" });
  }
};

module.exports = {
  create,
  getAll,
};
