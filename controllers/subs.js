const { prisma } = require("../prisma/prisma.client");

const subscribe = async (req, res) => {
  try {
    const { userId } = req.body;

    if (!userId) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const subscription = await prisma.subscription.create({
      data: {
        subscriberId: req.user.id,
        subscribedToId: +userId,
      },
    });

    res.status(201).json(subscription);
  } catch (error) {
    console.log(error);

    res.status(500).json({ message: "Unknown server error" });
  }
};

const unfollow = async (req, res) => {
  try {
    const { userId } = req.body;

    if (!userId) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const subscription = await prisma.subscription.delete({
      where: {
        subscriberId_subscribedToId: {
          subscriberId: req.user.id,
          subscribedToId: +userId,
        },
      },
    });

    res.status(200).json({ status: "success" });
  } catch (error) {
    console.log(error);
    
    res.status(500).json({ message: "Unknown server error" });
  }
};

const isMeFollowed = async (req, res) => {
  try {
    const { id } = req.params;

    const user = await prisma.user.findFirst({
      where: {
        id: +id,
        subscribedTo: {
          some: {
            subscriber: {
              id: {
                equals: req.user.id,
              },
            },
          },
        },
      },
      include: {
        subscribedTo: {
          include: {
            subscriber: true,
          },
        },
      },
    });

    if (!user) {
      return res.status(200).json({ isFollowed: false });
    }

    res.status(200).json({ isFollowed: !!user.subscribedTo });
  } catch (error) {
    console.log(error);

    res.status(500).json({ message: "Unknown server error" });
  }
};

module.exports = {
  subscribe,
  unfollow,
  isMeFollowed,
};
