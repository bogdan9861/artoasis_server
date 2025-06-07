const admin = async (req, res, next) => {
  try {
    const { role } = req.user;

    if (role !== "ADMIN") {
      return res.status(403).json({ message: "Access denied" });
    }

    next();
  } catch (error) {
    res.status(500).json({ message: "Check role error" });
  }
};

module.exports = {
  admin,
};
